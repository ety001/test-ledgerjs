/// <reference types="node" />
import { TIP712Message, MessageFilters, TIP712MessageTypesEntry, FilteringInfoShowField } from "./types";
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
export declare const intAsHexBytes: (int: number, bytes: number) => string;
export declare const padHexString: (str: string) => string;
export declare function hexBuffer(str: string): Buffer;
/**
 * @ignore for the README
 *
 * A Map of helpers to get the id and size to return for each
 * type that can be used in EIP712
 */
export declare const TIP712_TYPE_PROPERTIES: Record<string, {
    key: (size?: number) => number;
    sizeInBits: (size?: number) => number | null;
}>;
/**
 * @ignore for the README
 *
 * A Map of encoders to transform a value to formatted buffer
 */
export declare const TIP712_TYPE_ENCODERS: {
    INT(value: string | null, sizeInBits?: number): Buffer;
    UINT(value: string): Buffer;
    BOOL(value: number | string | boolean | null): Buffer;
    ADDRESS(value: string | null): Buffer;
    STRING(value: string | null): Buffer;
    BYTES(value: string | null, sizeInBits?: number): Buffer;
};
export declare const sortObjectAlphabetically: (obj: Record<string, unknown>) => Record<string, unknown>;
export declare const getSchemaHashForMessage: (message: TIP712Message) => string;
/**
 * Tries to find the proper filters for a given EIP712 message
 * in the CAL
 *
 * @param {EIP712Message} message
 * @returns {MessageFilters | undefined}
 */
export declare const getFiltersForMessage: (message: TIP712Message, shouldUseV1Filters?: boolean, calServiceURL?: string | null) => Promise<any>;
/**
 * Using a path as a string, returns the value(s) of a json key without worrying about depth or arrays
 * (e.g: 'to.wallets.[]' => ["0x123", "0x456"])
 */
export declare const getValueFromPath: (path: string, tip721Message: TIP712Message) => string | string[];
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
export declare const destructTypeFromString: (typeName?: string) => [{
    name: string;
    bits: number | undefined;
} | null, (number | null)[]];
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
export declare const constructTypeDescByteString: (isArray: boolean, typeSize: number | null | undefined, typeValue: number) => string;
/**
 * @ignore for the README
 *
 * Helper to create the buffer to describe an EIP712 types' entry structure
 *
 * @param {EIP712MessageTypesEntry} entry
 * @returns {Buffer}
 */
export declare const makeTypeEntryStructBuffer: ({ name, type }: TIP712MessageTypesEntry) => Buffer;
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
export declare const getCoinRefTokensMap: (filters: MessageFilters | undefined, shouldUseV1Filters: boolean, message: TIP712Message) => Record<number, {
    token: string;
    coinRefMemorySlot?: number;
}>;
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
export declare const getFilterDisplayNameAndSigBuffers: (displayName: string, sig: string) => {
    displayNameBuffer: Buffer;
    sigBuffer: Buffer;
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
export declare const getPayloadForFilterV2: (format: FilteringInfoShowField["format"], coinRef: FilteringInfoShowField["coinRef"], coinRefsTokensMap: FilteringInfoShowField["coinRefsTokensMap"], displayNameBuffer: Buffer, sigBuffer: Buffer) => Buffer;
//# sourceMappingURL=utils.d.ts.map