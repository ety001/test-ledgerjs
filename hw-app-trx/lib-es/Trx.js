var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/
// FIXME drop:
import { splitPath, foreach, decodeVarint } from "./utils";
import { signTIP712HashedMessage } from "./TIP712";
import { ledgerService } from "./services/ledger";
import { deserializeContractInfoFromHex } from "./services/contract";
export { ledgerService };
const remapTransactionRelatedErrors = e => {
    if (e && e.statusCode === 0x6a80) {
        // TODO:
    }
    return e;
};
const PATH_SIZE = 4;
const PATHS_LENGTH_SIZE = 1;
const CLA = 0xe0;
const ADDRESS = 0x02;
const SIGN = 0x04;
const SIGN_HASH = 0x05;
const CLEAR_SIGN = 0xc4;
const SIGN_MESSAGE = 0x08;
const INS_SIGN_PERSONAL_MESSAGE_FULL_DISPLAY = 0xc8;
const ECDH_SECRET = 0x0a;
const VERSION = 0x06;
const CHUNK_SIZE = 250;
/**
 * Tron API
 *
 * @example
 * import Trx from "@ledgerhq/hw-app-trx";
 * const trx = new Trx(transport)
 */
export default class Trx {
    setLoadConfig(loadConfig) {
        this.loadConfig = loadConfig;
    }
    constructor(transport, scrambleKey = "TRX", loadConfig = {}) {
        this.transport = transport;
        this.loadConfig = loadConfig;
        transport.decorateAppAPIMethods(this, [
            "getAddress",
            "getECDHPairKey",
            "signTransaction",
            "signTransactionHash",
            "signPersonalMessage",
            "signPersonalMessageFullDisplay",
            "signTIP712HashedMessage",
            "getAppConfiguration",
        ], scrambleKey);
    }
    /**
     * get Tron address for a given BIP 32 path.
     * @param path a path in BIP 32 format
     * @option boolDisplay optionally enable or not the display
     * @return an object with a publicKey and address
     * @example
     * const address = await tron.getAddress("44'/195'/0'/0/0").then(o => o.address)
     */
    getAddress(path, boolDisplay) {
        const paths = splitPath(path);
        const buffer = Buffer.alloc(PATHS_LENGTH_SIZE + paths.length * PATH_SIZE);
        buffer[0] = paths.length;
        paths.forEach((element, index) => {
            buffer.writeUInt32BE(element, 1 + 4 * index);
        });
        return this.transport
            .send(CLA, ADDRESS, boolDisplay ? 0x01 : 0x00, 0x00, buffer)
            .then(response => {
            const publicKeyLength = response[0];
            const addressLength = response[1 + publicKeyLength];
            return {
                publicKey: response.slice(1, 1 + publicKeyLength).toString("hex"),
                address: response
                    .slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength)
                    .toString("ascii"),
            };
        });
    }
    getNextLength(tx) {
        const field = decodeVarint(tx, 0);
        const data = decodeVarint(tx, field.pos);
        if ((field.value & 0x07) === 0)
            return data.pos;
        return data.value + data.pos;
    }
    /**
     * sign a Tron transaction with a given BIP 32 path and Token Names
     *
     * @param path a path in BIP 32 format
     * @param rawTxHex a raw transaction hex string
     * @param tokenSignatures Tokens Signatures array
     * @param resolution plugin infomations for clear sign. Only supported when sign a TriggerSmartContract transaction.
     *        - If the value is "null", clear sign will be disabled.
     *        - If the value is "undefined", default resolution will be used.
     * @option version pack message based on ledger firmware version
     * @option smartContract boolean hack to set limit buffer on ledger device
     * @return a signature as hex string
     * @example
     * import { ledgerService } from '@ledgerhq/hw-app-trx';
     * const rawTxHex = "0a0267a42208cb83283f5927a5e040c8badeb489325ab001081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a1541e2ae49db6a70b9b4757d2137a43b69b24a4457801215410e1bce983f78f8913002c3f7e52daf78de6da2cb2244a9059cbb000000000000000000000000573708726db88a32c1b9c828fef508577cfb8483000000000000000000000000000000000000000000000000000000000000000a286470a6f8dab48932900180ade204";
     * const resolution = await ledgerService.resolveTransaction(rawTxHex);
     * const signature = await tron.signTransaction("44'/195'/0'/0/0", rawTxHex, [], resolution);
     */
    signTransaction(path, rawTxHex, tokenSignatures, resolution) {
        return __awaiter(this, void 0, void 0, function* () {
            if (resolution === null || !deserializeContractInfoFromHex(rawTxHex)) {
                return this._signTransaction(path, rawTxHex, tokenSignatures);
            }
            if (resolution === undefined) {
                console.warn("hw-app-trx: signTransaction(path, rawTxHex, tokenSignatures, resolution): " +
                    "please provide the 'resolution' parameter. " +
                    "See https://github.com/LedgerHQ/ledgerjs/blob/master/packages/hw-app-trx/README.md " +
                    "– the previous signature is deprecated and providing the 3rd 'resolution' parameter explicitly will become mandatory so you have the control on the resolution and the fallback mecanism (e.g. fallback to blind signing or not)." +
                    "// Possible solution:\n" +
                    " + import { ledgerService } from '@ledgerhq/hw-app-trx';\n" +
                    " + const resolution = await ledgerService.resolveTransaction(rawTxHex);");
                resolution = yield ledgerService
                    .resolveTransaction(rawTxHex, this.loadConfig, {
                    externalPlugins: true,
                })
                    .catch(e => {
                    console.warn("an error occurred in resolveTransaction => fallback to blind signing: " + String(e));
                    return null;
                });
            }
            if (!resolution || resolution.externalPlugin.length === 0) {
                console.warn("[hw-app-trx]: signTransaction(path, rawTxHex, resolution): " +
                    "'resolution' is missing and Ledger will use blind signing.");
                return this._signTransaction(path, rawTxHex, tokenSignatures);
            }
            for (const { payload, signature } of resolution.externalPlugin) {
                yield this.setExternalPlugin(payload, signature);
            }
            return this._clearSignTransaction(path, rawTxHex);
        });
    }
    _signTransaction(path, rawTxHex, tokenSignatures) {
        const paths = splitPath(path);
        let rawTx = Buffer.from(rawTxHex, "hex");
        const toSend = [];
        let data = Buffer.alloc(PATHS_LENGTH_SIZE + paths.length * PATH_SIZE);
        // write path for first chuck only
        data[0] = paths.length;
        paths.forEach((element, index) => {
            data.writeUInt32BE(element, 1 + 4 * index);
        });
        while (rawTx.length > 0) {
            // get next message field
            const newpos = this.getNextLength(rawTx);
            if (newpos > CHUNK_SIZE)
                throw new Error("Too many bytes to encode.");
            if (data.length + newpos > CHUNK_SIZE) {
                toSend.push(data);
                data = Buffer.alloc(0);
                continue;
            }
            // append data
            data = Buffer.concat([data, rawTx.slice(0, newpos)]);
            rawTx = rawTx.slice(newpos, rawTx.length);
        }
        toSend.push(data);
        const startBytes = [];
        let response;
        const tokenPos = toSend.length;
        if (tokenSignatures !== undefined) {
            for (let i = 0; i < tokenSignatures.length; i += 1) {
                const buffer = Buffer.from(tokenSignatures[i], "hex");
                toSend.push(buffer);
            }
        }
        // get startBytes
        if (toSend.length === 1) {
            startBytes.push(0x10);
        }
        else {
            startBytes.push(0x00);
            for (let i = 1; i < toSend.length - 1; i += 1) {
                if (i >= tokenPos) {
                    startBytes.push(0xa0 | 0x00 | (i - tokenPos)); // eslint-disable-line no-bitwise
                }
                else {
                    startBytes.push(0x80);
                }
            }
            if (tokenSignatures !== undefined && tokenSignatures.length) {
                startBytes.push(0xa0 | 0x08 | (tokenSignatures.length - 1)); // eslint-disable-line no-bitwise
            }
            else {
                startBytes.push(0x90);
            }
        }
        return foreach(toSend, (data, i) => {
            return this.transport.send(CLA, SIGN, startBytes[i], 0x00, data).then(apduResponse => {
                response = apduResponse;
            });
        }).then(() => {
            return response.slice(0, 65).toString("hex");
        }, e => {
            throw remapTransactionRelatedErrors(e);
        });
    }
    _clearSignTransaction(path, rawTxHex) {
        const paths = splitPath(path);
        let rawTx = Buffer.from(rawTxHex, "hex");
        const toSend = [];
        let data = Buffer.alloc(PATHS_LENGTH_SIZE + paths.length * PATH_SIZE);
        // write path for first chunk only
        data[0] = paths.length;
        paths.forEach((element, index) => {
            data.writeUInt32BE(element, 1 + 4 * index);
        });
        while (rawTx.length > 0) {
            const newPos = CHUNK_SIZE - data.length;
            const buffer = Buffer.concat([data, rawTx.slice(0, newPos)]);
            toSend.push(buffer);
            data = Buffer.alloc(0);
            rawTx = rawTx.slice(newPos, rawTx.length);
        }
        const startBytes = [];
        let response;
        // get startBytes
        if (toSend.length === 1) {
            startBytes.push(0x10);
        }
        else {
            startBytes.push(0x00);
            for (let i = 1; i < toSend.length - 1; i += 1) {
                startBytes.push(0x80);
            }
            startBytes.push(0x90);
        }
        return foreach(toSend, (data, i) => {
            return this.transport.send(CLA, CLEAR_SIGN, startBytes[i], 0x00, data).then(apduResponse => {
                response = apduResponse;
            });
        }).then(() => {
            return response.slice(0, 65).toString("hex");
        }, e => {
            throw remapTransactionRelatedErrors(e);
        });
    }
    /**
     * sign a Tron transaction hash with a given BIP 32 path
     *
     * @param path a path in BIP 32 format
     * @param rawTxHex a raw transaction hex string
     * @return a signature as hex string
     * @example
     * const signature = await tron.signTransactionHash("44'/195'/0'/0/0", "25b18a55f86afb10e7aca38d0073d04c80397c6636069193953fdefaea0b8369");
     */
    signTransactionHash(path, rawTxHashHex) {
        const paths = splitPath(path);
        let data = Buffer.alloc(PATHS_LENGTH_SIZE + paths.length * PATH_SIZE);
        data[0] = paths.length;
        paths.forEach((element, index) => {
            data.writeUInt32BE(element, 1 + 4 * index);
        });
        data = Buffer.concat([data, Buffer.from(rawTxHashHex, "hex")]);
        return this.transport.send(CLA, SIGN_HASH, 0x00, 0x00, data).then(response => {
            return response.slice(0, 65).toString("hex");
        });
    }
    /**
     * sign a Tron transaction with a given BIP 32 using clear signing. This method will use default plugin service to resolve the plugin for transaction.
     * @param path a path in BIP 32 format
     * @param rawTxHex a raw transaction hex string
     * @param resolutionConfig: configuration about what should be clear signed in the transaction
     * @param throwOnError: optional parameter to determine if a failing resolution of the transaction should throw an error or not
     * @return a signature as hex string
     * @example
     * const signature = await tron.clearSignTransaction("44'/195'/0'/0/0", "0a0267a42208cb83283f5927a5e040c8badeb489325ab001081f12a9010a31747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e54726967676572536d617274436f6e747261637412740a1541e2ae49db6a70b9b4757d2137a43b69b24a4457801215410e1bce983f78f8913002c3f7e52daf78de6da2cb2244a9059cbb000000000000000000000000573708726db88a32c1b9c828fef508577cfb8483000000000000000000000000000000000000000000000000000000000000000a286470a6f8dab48932900180ade204",{externalPlugins: true});
     */
    clearSignTransaction(path_1, rawTxHex_1, resolutionConfig_1) {
        return __awaiter(this, arguments, void 0, function* (path, rawTxHex, resolutionConfig, throwOnError = false) {
            const resolution = yield ledgerService
                .resolveTransaction(rawTxHex, this.loadConfig, resolutionConfig)
                .catch(e => {
                console.warn("an error occurred in resolveTransaction => fallback to blind signing: " + String(e));
                if (throwOnError) {
                    throw e;
                }
                return null;
            });
            return this.signTransaction(path, rawTxHex, [], resolution);
        });
    }
    /**
     * get the version of the Tron app installed on the hardware device
     *
     * @return an object with a version
     * @example
     * const result = await tron.getAppConfiguration();
     * {
     *   "version": "0.1.5",
     *   "versionN": "105".
     *   "allowData": false,
     *   "allowContract": false,
     *   "truncateAddress": false,
     *   "signByHash": false
     * }
     */
    getAppConfiguration() {
        return this.transport.send(CLA, VERSION, 0x00, 0x00).then(response => {
            // eslint-disable-next-line no-bitwise
            const signByHash = (response[0] & (1 << 3)) > 0;
            // eslint-disable-next-line no-bitwise
            let truncateAddress = (response[0] & (1 << 2)) > 0;
            // eslint-disable-next-line no-bitwise
            let allowContract = (response[0] & (1 << 1)) > 0;
            // eslint-disable-next-line no-bitwise
            let allowData = (response[0] & (1 << 0)) > 0;
            if (response[1] === 0 && response[2] === 1 && response[3] < 2) {
                allowData = true;
                allowContract = false;
            }
            if (response[1] === 0 && response[2] === 1 && response[3] < 5) {
                truncateAddress = false;
            }
            const result = {
                version: `${response[1]}.${response[2]}.${response[3]}`,
                versionN: response[1] * 10000 + response[2] * 100 + response[3],
                allowData,
                allowContract,
                truncateAddress,
                signByHash,
            };
            return result;
        });
    }
    /**
     * sign a Tron Message with a given BIP 32 path
     *
     * @param path a path in BIP 32 format
     * @param message hex string to sign
     * @return a signature as hex string
     * @example
     * const signature = await tron.signPersonalMessage("44'/195'/0'/0/0", "43727970746f436861696e2d54726f6e5352204c6564676572205472616e73616374696f6e73205465737473");
     */
    signPersonalMessage(path, messageHex) {
        const paths = splitPath(path);
        const message = Buffer.from(messageHex, "hex");
        let offset = 0;
        const toSend = [];
        const size = message.length.toString(16);
        const sizePack = "00000000".substr(size.length) + size;
        const packed = Buffer.concat([Buffer.from(sizePack, "hex"), message]);
        while (offset < packed.length) {
            // Use small buffer to be compatible with old and new protocol
            const maxChunkSize = offset === 0 ? CHUNK_SIZE - 1 - paths.length * 4 : CHUNK_SIZE;
            const chunkSize = offset + maxChunkSize > packed.length ? packed.length - offset : maxChunkSize;
            const buffer = Buffer.alloc(offset === 0 ? 1 + paths.length * 4 + chunkSize : chunkSize);
            if (offset === 0) {
                buffer[0] = paths.length;
                paths.forEach((element, index) => {
                    buffer.writeUInt32BE(element, 1 + 4 * index);
                });
                packed.copy(buffer, 1 + 4 * paths.length, offset, offset + chunkSize);
            }
            else {
                packed.copy(buffer, 0, offset, offset + chunkSize);
            }
            toSend.push(buffer);
            offset += chunkSize;
        }
        let response;
        return foreach(toSend, (data, i) => {
            console.log("======toSend======");
            console.log(toSend);
            console.log("======data======");
            console.log(data);
            return this.transport
                .send(CLA, SIGN_MESSAGE, i === 0 ? 0x00 : 0x80, 0x00, data)
                .then(apduResponse => {
                response = apduResponse;
            });
        }).then(() => {
            return response.slice(0, 65).toString("hex");
        });
    }
    /**
     * sign a Tron Message with a given BIP 32 path
     *
     * @param path a path in BIP 32 format
     * @param message hex string to sign
     * @return a signature as hex string
     * @example
     * const signature = await tron.signPersonalMessageFullDisplay("44'/195'/0'/0/0", "43727970746f436861696e2d54726f6e5352204c6564676572205472616e73616374696f6e73205465737473");
     */
    signPersonalMessageFullDisplay(path, messageHex) {
        const paths = splitPath(path);
        const message = Buffer.from(messageHex, "hex");
        let offset = 0;
        const toSend = [];
        const size = message.length.toString(16);
        const sizePack = "00000000".substr(size.length) + size;
        const packed = Buffer.concat([Buffer.from(sizePack, "hex"), message]);
        while (offset < packed.length) {
            // Use small buffer to be compatible with old and new protocol
            const maxChunkSize = offset === 0 ? CHUNK_SIZE - 1 - paths.length * 4 : CHUNK_SIZE;
            const chunkSize = offset + maxChunkSize > packed.length ? packed.length - offset : maxChunkSize;
            const buffer = Buffer.alloc(offset === 0 ? 1 + paths.length * 4 + chunkSize : chunkSize);
            if (offset === 0) {
                buffer[0] = paths.length;
                paths.forEach((element, index) => {
                    buffer.writeUInt32BE(element, 1 + 4 * index);
                });
                packed.copy(buffer, 1 + 4 * paths.length, offset, offset + chunkSize);
            }
            else {
                packed.copy(buffer, 0, offset, offset + chunkSize);
            }
            toSend.push(buffer);
            offset += chunkSize;
        }
        let response;
        return foreach(toSend, (data, i) => {
            console.log("======toSend======");
            console.log(toSend);
            console.log("======data======");
            console.log(data);
            return this.transport
                .send(CLA, INS_SIGN_PERSONAL_MESSAGE_FULL_DISPLAY, i === 0 ? 0x00 : 0x80, 0x00, data)
                .then(apduResponse => {
                response = apduResponse;
            });
        }).then(() => {
            return response.slice(0, 65).toString("hex");
        });
    }
    /**
     * Sign a typed data. The host computes the domain separator and hashStruct(message)
     * @example
       const signature = await tronApp.signTIP712HashedMessage("44'/195'/0'/0/0",Buffer.from( "0101010101010101010101010101010101010101010101010101010101010101").toString("hex"), Buffer.from("0202020202020202020202020202020202020202020202020202020202020202").toString("hex"));
     */
    signTIP712HashedMessage(path, domainSeparatorHex, hashStructMessageHex) {
        return signTIP712HashedMessage(this.transport, path, domainSeparatorHex, hashStructMessageHex);
    }
    /**
     * get Tron address for a given BIP 32 path.
     * @param path a path in BIP 32 format
     * @param publicKey address public key to generate pair key
     * @return shared key hex string,
     * @example
     * const signature = await tron.getECDHPairKey("44'/195'/0'/0/0", "04ff21f8e64d3a3c0198edfbb7afdc79be959432e92e2f8a1984bb436a414b8edcec0345aad0c1bf7da04fd036dd7f9f617e30669224283d950fab9dd84831dc83");
     */
    getECDHPairKey(path, publicKey) {
        const paths = splitPath(path);
        const data = Buffer.from(publicKey, "hex");
        const buffer = Buffer.alloc(1 + paths.length * 4 + data.length);
        buffer[0] = paths.length;
        paths.forEach((element, index) => {
            buffer.writeUInt32BE(element, 1 + 4 * index);
        });
        data.copy(buffer, 1 + 4 * paths.length, 0, data.length);
        return this.transport
            .send(CLA, ECDH_SECRET, 0x00, 0x01, buffer)
            .then(response => response.slice(0, 65).toString("hex"));
    }
    /**
     * provides the name of a trusted binding of a plugin with a contract address and a supported method selector.
     * This plugin will be called to interpret contract data in the following transaction signing command.
     *
     * @param payload external plugin data
     * @param signature signature for the plugin
     * @returns boolean. It's `true` when set plugin successfully.
     */
    setExternalPlugin(payload, signature) {
        const payloadBuffer = Buffer.from(payload, "hex");
        const signatureBuffer = Buffer.from(signature, "hex");
        const buffer = Buffer.concat([payloadBuffer, signatureBuffer]);
        return this.transport.send(0xe0, 0x12, 0x00, 0x00, buffer).then(() => true, e => {
            if (e && e.statusCode === 0x6700) {
                // the plugin name is too short or too long
                return false;
            }
            else if (e && e.statusCode === 0x6a80) {
                // the signature does not match the plugin data
                return false;
            }
            else if (e && e.statusCode === 0x6984) {
                // the plugin requested is not installed on the device
                return false;
            }
            console.error("[hw-app-trx]: setExternalPlugin: error " + String(e));
            throw e;
        });
    }
}
//# sourceMappingURL=Trx.js.map