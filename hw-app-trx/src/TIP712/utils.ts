import { ethers } from "ethers";
import axios from "axios";
import SHA224 from "crypto-js/sha224";
import {
  TIP712Message,
  MessageFilters,
  CALServiceTIP712Response,
  TIP712MessageTypesEntry,
  FilteringInfoShowField,
} from "./types";
import { BigNumber } from "bignumber.js";
import EIP712CALV2 from "@ledgerhq/cryptoassets/data/eip712_v2";

/**
 * @ignore for the README
 *
 * Helper to convert an integer as a hexadecimal string with the right amount of digits
 * to respect the number of bytes given as parameter
 *
 * @param int Integer
 * @param bytes Number of bytes it should be represented as (1 byte = 2 caraters)
 * @returns The given integer as an hexa string padded with the right number of 0
 */
export const intAsHexBytes = (int: number, bytes: number): string =>
  int.toString(16).padStart(2 * bytes, "0");

export const padHexString = (str: string) => {
  return str.length % 2 ? "0" + str : str;
};

export function hexBuffer(str: string): Buffer {
  const strWithoutPrefix = str.startsWith("0x") ? str.slice(2) : str;
  return Buffer.from(padHexString(strWithoutPrefix), "hex");
}

/**
 * @ignore for the README
 *
 * A Map of helpers to get the wanted binary value for
 * each type of array possible in a type definition
 */
enum TIP712_ARRAY_TYPE_VALUE {
  DYNAMIC = 0,
  FIXED = 1,
}

/**
 * @ignore for the README
 *
 * A Map of helpers to get the id and size to return for each
 * type that can be used in EIP712
 */
export const TIP712_TYPE_PROPERTIES: Record<
  string,
  {
    key: (size?: number) => number;
    sizeInBits: (size?: number) => number | null;
  }
> = {
  CUSTOM: {
    key: () => 0,
    sizeInBits: () => null,
  },
  INT: {
    key: () => 1,
    sizeInBits: size => Number(size) / 8,
  },
  UINT: {
    key: () => 2,
    sizeInBits: size => Number(size) / 8,
  },
  ADDRESS: {
    key: () => 3,
    sizeInBits: () => null,
  },
  BOOL: {
    key: () => 4,
    sizeInBits: () => null,
  },
  STRING: {
    key: () => 5,
    sizeInBits: () => null,
  },
  BYTES: {
    key: size => (typeof size !== "undefined" ? 6 : 7),
    sizeInBits: size => (typeof size !== "undefined" ? Number(size) : null),
  },
};

/**
 * @ignore for the README
 *
 * A Map of encoders to transform a value to formatted buffer
 */
export const TIP712_TYPE_ENCODERS = {
  INT(value: string | null, sizeInBits = 256): Buffer {
    const failSafeValue = value ?? "0";

    if (typeof failSafeValue === "string" && failSafeValue?.startsWith("0x")) {
      return hexBuffer(failSafeValue);
    }

    let valueAsBN = new BigNumber(failSafeValue);
    // If negative we'll use `two's complement` method to
    // "reversibly convert a positive binary number into a negative binary number with equivalent (but negative) value".
    // thx wikipedia
    if (valueAsBN.lt(0)) {
      const sizeInBytes = sizeInBits / 8;
      // Creates BN from a buffer serving as a mask filled by maximum value 0xff
      const maskAsBN = new BigNumber(`0x${Buffer.alloc(sizeInBytes, 0xff).toString("hex")}`);

      // two's complement version of value
      valueAsBN = maskAsBN.plus(valueAsBN).plus(1);
    }

    const paddedHexString =
      valueAsBN.toString(16).length % 2 ? "0" + valueAsBN.toString(16) : valueAsBN.toString(16);

    return Buffer.from(paddedHexString, "hex");
  },

  UINT(value: string): Buffer {
    return this.INT(value);
  },

  BOOL(value: number | string | boolean | null): Buffer {
    return this.INT(typeof value === "boolean" ? Number(value).toString() : value);
  },

  ADDRESS(value: string | null): Buffer {
    // Only sending the first 10 bytes (why ?)
    return hexBuffer(value ?? "").slice(0, 20);
  },

  STRING(value: string | null): Buffer {
    return Buffer.from(value ?? "", "utf-8");
  },

  BYTES(value: string | null, sizeInBits?: number): Buffer {
    const failSafeValue = value ?? "";
    // Why slice again ?
    return hexBuffer(failSafeValue).slice(0, sizeInBits ?? (failSafeValue?.length - 2) / 2);
  },
};

export const sortObjectAlphabetically = (obj: Record<string, unknown>): Record<string, unknown> => {
  const keys = Object.keys(obj).sort();

  return keys.reduce((acc, curr) => {
    const value = (() => {
      if (Array.isArray(obj[curr])) {
        return (obj[curr] as unknown[]).map(field =>
          sortObjectAlphabetically(field as Record<string, unknown>),
        );
      }
      return obj[curr];
    })();

    (acc as Record<string, unknown>)[curr] = value;
    return acc;
  }, {});
};

export const getSchemaHashForMessage = (message: TIP712Message): string => {
  const { types } = message;
  const sortedTypes = sortObjectAlphabetically(types);

  return SHA224(JSON.stringify(sortedTypes).replace(" ", "")).toString();
};

/**
 * Tries to find the proper filters for a given EIP712 message
 * in the CAL
 *
 * @param {EIP712Message} message
 * @returns {MessageFilters | undefined}
 */
export const getFiltersForMessage = async (
  message: TIP712Message,
  shouldUseV1Filters?: boolean,
  calServiceURL?: string | null,
): Promise<any> => {
  const schemaHash = getSchemaHashForMessage(message);
  const verifyingContract =
    message.domain?.verifyingContract?.toLowerCase() || ethers.constants.AddressZero;
  try {
    if (calServiceURL) {
      // const { data } = await axios.get<CALServiceTIP712Response>(`${calServiceURL}/v1/dapps`, {
      //   params: {
      //     output: "tip712_signatures",
      //     eip712_signatures_version: shouldUseV1Filters ? "v1" : "v2",
      //     chain_id: message.domain?.chainId,
      //     contracts: verifyingContract,
      //   },
      // });

      const data = [
        {
          eip712_signatures: {
            "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC": {
              "3168f19a558603d50796e8a54bef73db90af3ea57c2e133c5da24344": {
                contractName: {
                  label: "Advanced Filtering",
                  signature:
                    "3045022100b1cf67ac7a179e4ac022a6692c037bdabc1e536992a9e20909f3cd4416e50d5e02200248e7edadcf43f1eece969a06e23010f40d92410b1066053363366d2f659d4c",
                },
                fields: [
                  {
                    coin_ref: 0,
                    format: "amount",
                    label: "Send",
                    path: "value_send",
                    signature:
                      "3045022100e4b87016acac590bdf876f36a0981e60fea7282a4a031c63644787b674cfc88202204559b7ed94e5d63edf91a161cb2a6c3fc3a6d99f6ae067086d2c7729b64bea46",
                  },
                  {
                    coin_ref: 0,
                    format: "token",
                    path: "token_send",
                    signature:
                      "30450220039522f56a4f6b279723049272f10a59738a312bdd469f36d294cbb551506da1022100c06c05eaef00c1090d9679cadae7f862752b6e498c2e508253675ca49b959605",
                  },
                  {
                    coin_ref: 1,
                    format: "amount",
                    label: "Receive",
                    path: "value_recv",
                    signature:
                      "3045022100cb66f1879e4d04428b4f3010b1f06b0a545ea543caf8adb3936a7d2c3508677402204efd6ff87943bf44e6c3066ba8822f697296f289ee05c0333e6b656a8b9240ba",
                  },
                  {
                    coin_ref: 1,
                    format: "token",
                    path: "token_recv",
                    signature:
                      "304402207b2b38508486f27d2d0108c272e31ef0f5292de4684efa275c66c6fc05782915022003c007acb43cc453a1494f9c5cf414de3187ef3d47471a1a4da2b351e3515dee",
                  },
                  {
                    format: "raw",
                    label: "With",
                    path: "with",
                    signature:
                      "304502204b63b2f8f6016bdf4477969bce85ef971c637e25ed6657b4b32f1bb4338f099b022100e2e6a40c3d16f835b3dde8bc03e4ea5c318038a483b183afa44899e4af6eca82",
                  },
                  {
                    format: "datetime",
                    label: "Will Expire",
                    path: "expires",
                    signature:
                      "30440220631769cf744a1e8c2a9a3efb7df9a6285c09c601bbced737d8be1cdd66851f8b02205d88ed61e86f6408ccce2cf741fe2955f229a5b6f9d3e006a0e692c40577a2d3",
                  },
                ],
              },
            },
          },
        },
      ];

      const filters =
        data?.[0]?.eip712_signatures?.["0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"]?.[
          "3168f19a558603d50796e8a54bef73db90af3ea57c2e133c5da24344"
        ];
      if (!filters) {
        // Fallback to catch
        throw new Error("Fallback to static file");
      }

      return filters;
    }
    // Fallback to catch
    throw new Error("Fallback to static file");
  } catch (e) {
    const messageId = `${message.domain?.chainId ?? 0}:${verifyingContract}:${schemaHash}`;

    return EIP712CALV2[messageId as keyof typeof EIP712CALV2] as MessageFilters;
  }
};

/**
 * Get the value at a specific path of an object and return it as a string or as an array of string
 * Used recursively by getValueFromPath
 *
 * @see getValueFromPath
 */
const getValue = (
  path: string,
  value: Record<string, any> | Array<any> | string,
): Record<string, any> | Array<any> | string => {
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.map(v => getValue(path, v)).flat();
    }

    /* istanbul ignore if : unecessary test of a throw */
    if (!(path in value)) {
      throw new Error(`Could not find key ${path} in ${JSON.stringify(value)} `);
    }
    const result = value[path];
    return typeof result === "object" ? result : result.toString();
  }

  return value.toString();
};

/**
 * Using a path as a string, returns the value(s) of a json key without worrying about depth or arrays
 * (e.g: 'to.wallets.[]' => ["0x123", "0x456"])
 */
export const getValueFromPath = (path: string, tip721Message: TIP712Message): string | string[] => {
  const splittedPath = path.split(".");
  const { message } = tip721Message;

  let value: any = message;
  for (let i = 0; i <= splittedPath.length - 1; i++) {
    const subPath = splittedPath[i];
    const isLastElement = i >= splittedPath.length - 1;
    if (subPath === "[]" && !isLastElement) continue;

    value = getValue(subPath, value);
  }

  /* istanbul ignore if : unecessary test of a throw */
  if (value === message) {
    throw new Error("getValueFromPath returned the whole original message");
  }

  return value as string | string[];
};

/**
 * @ignore for the README
 *
 * Helper parsing an EIP712 Type name to return its type and size(s)
 * if it's an array or nested arrays
 *
 * @see EIP712MessageTypes
 *
 * @example "uint8[2][][4]" => [{name: "uint", bits: 8}, [2, null, 4]]
 * @example "bool" => [{name: "bool", bits: null}, []]
 *
 * @param {String} typeName
 * @returns {[{ name: string; bits: Number | null }, Array<Number | null | undefined>]}
 */
export const destructTypeFromString = (
  typeName?: string,
): [{ name: string; bits: number | undefined } | null, Array<number | null>] => {
  // Will split "any[][1][10]" in "any", "[][1][10]"
  const splitNameAndArraysRegex = new RegExp(/^([^[\]]*)(\[.*\])*/g);
  // Will match all numbers (or null) inside each array. [0][10][] => [0,10,null]
  const splitArraysRegex = new RegExp(/\[(\d*)\]/g);
  // Will separate the the name from the potential bits allocation. uint8 => [uint,8]
  const splitNameAndNumberRegex = new RegExp(/(\D*)(\d*)/);

  const [, type, maybeArrays] = splitNameAndArraysRegex.exec(typeName || "") || [];
  const [, name, bits] = splitNameAndNumberRegex.exec(type || "") || [];
  const typeDescription = name ? { name, bits: bits ? Number(bits) : undefined } : null;

  const arrays = maybeArrays ? [...maybeArrays.matchAll(splitArraysRegex)] : [];
  // Parse each size to either a Number or null
  const arraySizes = arrays.map(([, size]) => (size ? Number(size) : null));

  return [typeDescription, arraySizes];
};

/**
 * @ignore for the README
 *
 * Helper to construct the hexadecimal ByteString for the description
 * of a field in an EIP712 Message
 *
 * @param isArray
 * @param typeSize
 * @param typeValue
 * @returns {String} HexByteString
 */
export const constructTypeDescByteString = (
  isArray: boolean,
  typeSize: number | null | undefined,
  typeValue: number,
): string => {
  if (typeValue >= 16) {
    throw new Error(
      "Eth utils - constructTypeDescByteString - Cannot accept a typeValue >= 16 because the typeValue can only be 4 bits in binary" +
        { isArray, typeSize, typeValue },
    );
  }
  // 1 is array, 0 is not array
  const isArrayBit = isArray ? "1" : "0";
  // 1 has type size, 0 has no type size
  const hasTypeSize = typeof typeSize === "number" ? "1" : "0";
  // 2 unused bits
  const unusedBits = "00";
  // type key as 4 bits
  const typeValueBits = typeValue.toString(2).padStart(4, "0");

  return intAsHexBytes(parseInt(isArrayBit + hasTypeSize + unusedBits + typeValueBits, 2), 1);
};

/**
 * @ignore for the README
 *
 * Helper to create the buffer to describe an EIP712 types' entry structure
 *
 * @param {EIP712MessageTypesEntry} entry
 * @returns {Buffer}
 */
export const makeTypeEntryStructBuffer = ({ name, type }: TIP712MessageTypesEntry): Buffer => {
  const [typeDescription, arrSizes] = destructTypeFromString(type as string);
  const isTypeAnArray = Boolean(arrSizes.length);
  const typeProperties =
    TIP712_TYPE_PROPERTIES[typeDescription?.name?.toUpperCase() || ""] ||
    TIP712_TYPE_PROPERTIES.CUSTOM;

  const typeKey = typeProperties.key(typeDescription?.bits);
  const typeSizeInBits = typeProperties.sizeInBits(typeDescription?.bits);

  const typeDescData = constructTypeDescByteString(isTypeAnArray, typeSizeInBits, typeKey);

  const bufferArray: Buffer[] = [Buffer.from(typeDescData, "hex")];

  if (typeProperties === TIP712_TYPE_PROPERTIES.CUSTOM) {
    bufferArray.push(Buffer.from(intAsHexBytes(typeDescription?.name?.length ?? 0, 1), "hex"));
    bufferArray.push(Buffer.from(typeDescription?.name ?? "", "utf-8"));
  }

  if (typeof typeSizeInBits === "number") {
    bufferArray.push(Buffer.from(intAsHexBytes(typeSizeInBits, 1), "hex"));
  }

  if (isTypeAnArray) {
    bufferArray.push(Buffer.from(intAsHexBytes(arrSizes.length, 1), "hex"));

    arrSizes.forEach(size => {
      if (typeof size === "number") {
        bufferArray.push(
          Buffer.from(intAsHexBytes(TIP712_ARRAY_TYPE_VALUE.FIXED, 1), "hex"),
          Buffer.from(intAsHexBytes(size, 1), "hex"),
        );
      } else {
        bufferArray.push(Buffer.from(intAsHexBytes(TIP712_ARRAY_TYPE_VALUE.DYNAMIC, 1), "hex"));
      }
    });
  }

  bufferArray.push(Buffer.from(intAsHexBytes(name.length, 1), "hex"), Buffer.from(name, "utf-8"));

  return Buffer.concat(bufferArray);
};

/**
 * @ignore for the README
 *
 * Creates a map for each token provided with a `provideERC20TokenInfo` APDU
 * in order to keep track of their index in the memory of the device
 *
 * @param {MessageFilters | undefined} filters
 * @param {boolean} shouldUseV1Filters
 * @param {EIP712Message} message
 * @returns {Record<number, { token: string; coinRefMemorySlot?: number }>}
 */
export const getCoinRefTokensMap = (
  filters: MessageFilters | undefined,
  shouldUseV1Filters: boolean,
  message: TIP712Message,
): Record<number, { token: string; coinRefMemorySlot?: number }> => {
  const coinRefsTokensMap: Record<number, { token: string; coinRefMemorySlot?: number }> = {};
  if (shouldUseV1Filters || !filters) return coinRefsTokensMap;

  const tokenFilters = filters.fields.filter(({ format }) => format === "token");
  const tokens = tokenFilters.reduce<{ token: string; coinRef: number }[]>((acc, filter) => {
    const token = getValueFromPath(filter.path, message);
    if (Array.isArray(token)) {
      throw new Error("Array of tokens is not supported with a single coin ref");
    }

    return [...acc, { token, coinRef: filter.coin_ref! }];
  }, []);
  for (const { token, coinRef } of tokens) {
    coinRefsTokensMap[coinRef] = { token };
  }

  // For some messages like a Permit has no token address in its message, only the amount is provided.
  // In those cases, we'll need to provide the verifying contract contained in the EIP712 domain
  // The verifying contract is refrerenced by the coinRef 255 (0xff) in CAL and in the device
  // independently of the token index returned by the app after a providerERC20TokenInfo
  const shouldUseVerifyingContract = filters.fields.some(
    filter => filter.format === "amount" && filter.coin_ref === 255,
  );
  if (shouldUseVerifyingContract && message.domain.verifyingContract) {
    coinRefsTokensMap[255] = { token: message.domain.verifyingContract };
  }

  return coinRefsTokensMap;
};

/**
 * @ignore for the README
 *
 * Helper creating the buffer representing the display name and signature
 * of a filter which are prefixes & suffixes of a all V2 payloads
 *
 * @param {string} displayName
 * @param {string} sig
 * @returns {{ displayNameBuffer: Buffer; sigBuffer: Buffer }}
 */
export const getFilterDisplayNameAndSigBuffers = (
  displayName: string,
  sig: string,
): { displayNameBuffer: Buffer; sigBuffer: Buffer } => {
  const displayNameContentBuffer = Buffer.from(displayName);
  const displayNameLengthBuffer = Buffer.from(
    intAsHexBytes(displayNameContentBuffer.length, 1),
    "hex",
  );

  const sigContentBuffer = Buffer.from(sig, "hex");
  const sigLengthBuffer = Buffer.from(intAsHexBytes(sigContentBuffer.length, 1), "hex");

  return {
    displayNameBuffer: Buffer.concat([displayNameLengthBuffer, displayNameContentBuffer]),
    sigBuffer: Buffer.concat([sigLengthBuffer, sigContentBuffer]),
  };
};

/**
 * @ignore for the README
 *
 * Creates the payload for V2 filters following the spec provided here:
 *
 * @see https://github.com/LedgerHQ/app-ethereum/blob/develop/doc/ethapp.adoc#if-p2--message-info
 *
 * @param {FilteringInfoShowField["format"]} format
 * @param {FilteringInfoShowField["coinRef"]} coinRef
 * @param {FilteringInfoShowField["coinRefsTokensMap"]} coinRefsTokensMap
 * @param {Buffer} displayNameBuffer
 * @param {Buffer} sigBuffer
 * @returns {Buffer}
 */
export const getPayloadForFilterV2 = (
  format: FilteringInfoShowField["format"],
  coinRef: FilteringInfoShowField["coinRef"],
  coinRefsTokensMap: FilteringInfoShowField["coinRefsTokensMap"],
  displayNameBuffer: Buffer,
  sigBuffer: Buffer,
): Buffer => {
  switch (format) {
    case "raw":
    case "datetime":
      return Buffer.concat([displayNameBuffer, sigBuffer]);

    case "token": {
      const { deviceTokenIndex } = coinRefsTokensMap[coinRef!];
      if (typeof deviceTokenIndex === "undefined") {
        throw new Error("Missing coinRef");
      }

      return Buffer.concat([Buffer.from(intAsHexBytes(deviceTokenIndex, 1), "hex"), sigBuffer]);
    }

    case "amount": {
      const { deviceTokenIndex } = coinRefsTokensMap[coinRef!];
      if (typeof deviceTokenIndex === "undefined") {
        throw new Error("Missing coinRef");
      }

      return Buffer.concat([
        displayNameBuffer,
        Buffer.from(intAsHexBytes(deviceTokenIndex, 1), "hex"),
        sigBuffer,
      ]);
    }

    default:
      throw new Error("Invalid format");
  }
};
