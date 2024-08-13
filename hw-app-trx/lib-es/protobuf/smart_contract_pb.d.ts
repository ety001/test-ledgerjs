/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
declare const SmartContract: {
    (opt_data: any): void;
    /**
     * @public
     * @override
     */
    displayName: string;
    /**
     * Generated by JsPbCodeGenerator.
     * @param {Array=} opt_data Optional initial data array, typically from a
     * server response, or constructed directly in Javascript. The array is used
     * in place and becomes part of the constructed object. It is not cloned.
     * If no data is provided, the constructed object will be empty, but still
     * valid.
     * @extends {jspb.Message}
     * @constructor
     */
    ABI(opt_data: any): void;
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Deprecated. Whether to include
     *     the JSPB instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!SmartContract} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    toObject(includeInstance: any, msg: any): {
        originAddress: any;
        contractAddress: any;
        abi: any;
        bytecode: any;
        callValue: any;
        consumeUserResourcePercent: any;
        name: any;
        originEnergyLimit: any;
        codeHash: any;
        trxHash: any;
    };
    /**
     * Deserializes binary data (in protobuf wire format).
     * @param {jspb.ByteSource} bytes The bytes to deserialize.
     * @return {!SmartContract}
     */
    deserializeBinary(bytes: any): any;
    /**
     * Deserializes binary data (in protobuf wire format) from the
     * given reader into the given message object.
     * @param {!SmartContract} msg The message object to deserialize into.
     * @param {!jspb.BinaryReader} reader The BinaryReader to use.
     * @return {!SmartContract}
     */
    deserializeBinaryFromReader(msg: any, reader: any): any;
    /**
     * Serializes the given message to binary data (in protobuf wire
     * format), writing to the given BinaryWriter.
     * @param {!SmartContract} message
     * @param {!jspb.BinaryWriter} writer
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    serializeBinaryToWriter(message: any, writer: any): void;
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
declare const CreateSmartContract: {
    (opt_data: any): void;
    /**
     * @public
     * @override
     */
    displayName: string;
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Deprecated. Whether to include
     *     the JSPB instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!CreateSmartContract} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    toObject(includeInstance: any, msg: any): {
        ownerAddress: any;
        newContract: any;
        callTokenValue: any;
        tokenId: any;
    };
    /**
     * Deserializes binary data (in protobuf wire format).
     * @param {jspb.ByteSource} bytes The bytes to deserialize.
     * @return {!CreateSmartContract}
     */
    deserializeBinary(bytes: any): any;
    /**
     * Deserializes binary data (in protobuf wire format) from the
     * given reader into the given message object.
     * @param {!CreateSmartContract} msg The message object to deserialize into.
     * @param {!jspb.BinaryReader} reader The BinaryReader to use.
     * @return {!CreateSmartContract}
     */
    deserializeBinaryFromReader(msg: any, reader: any): any;
    /**
     * Serializes the given message to binary data (in protobuf wire
     * format), writing to the given BinaryWriter.
     * @param {!CreateSmartContract} message
     * @param {!jspb.BinaryWriter} writer
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    serializeBinaryToWriter(message: any, writer: any): void;
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
declare const TriggerSmartContract: {
    (opt_data: any): void;
    /**
     * @public
     * @override
     */
    displayName: string;
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Deprecated. Whether to include
     *     the JSPB instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!TriggerSmartContract} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    toObject(includeInstance: any, msg: any): {
        ownerAddress: any;
        contractAddress: any;
        callValue: any;
        data: any;
        callTokenValue: any;
        tokenId: any;
    };
    /**
     * Deserializes binary data (in protobuf wire format).
     * @param {jspb.ByteSource} bytes The bytes to deserialize.
     * @return {!TriggerSmartContract}
     */
    deserializeBinary(bytes: any): any;
    /**
     * Deserializes binary data (in protobuf wire format) from the
     * given reader into the given message object.
     * @param {!TriggerSmartContract} msg The message object to deserialize into.
     * @param {!jspb.BinaryReader} reader The BinaryReader to use.
     * @return {!TriggerSmartContract}
     */
    deserializeBinaryFromReader(msg: any, reader: any): any;
    /**
     * Serializes the given message to binary data (in protobuf wire
     * format), writing to the given BinaryWriter.
     * @param {!TriggerSmartContract} message
     * @param {!jspb.BinaryWriter} writer
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    serializeBinaryToWriter(message: any, writer: any): void;
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
declare const ClearABIContract: {
    (opt_data: any): void;
    /**
     * @public
     * @override
     */
    displayName: string;
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Deprecated. Whether to include
     *     the JSPB instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!ClearABIContract} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    toObject(includeInstance: any, msg: any): {
        ownerAddress: any;
        contractAddress: any;
    };
    /**
     * Deserializes binary data (in protobuf wire format).
     * @param {jspb.ByteSource} bytes The bytes to deserialize.
     * @return {!ClearABIContract}
     */
    deserializeBinary(bytes: any): any;
    /**
     * Deserializes binary data (in protobuf wire format) from the
     * given reader into the given message object.
     * @param {!ClearABIContract} msg The message object to deserialize into.
     * @param {!jspb.BinaryReader} reader The BinaryReader to use.
     * @return {!ClearABIContract}
     */
    deserializeBinaryFromReader(msg: any, reader: any): any;
    /**
     * Serializes the given message to binary data (in protobuf wire
     * format), writing to the given BinaryWriter.
     * @param {!ClearABIContract} message
     * @param {!jspb.BinaryWriter} writer
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    serializeBinaryToWriter(message: any, writer: any): void;
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
declare const UpdateSettingContract: {
    (opt_data: any): void;
    /**
     * @public
     * @override
     */
    displayName: string;
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Deprecated. Whether to include
     *     the JSPB instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!UpdateSettingContract} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    toObject(includeInstance: any, msg: any): {
        ownerAddress: any;
        contractAddress: any;
        consumeUserResourcePercent: any;
    };
    /**
     * Deserializes binary data (in protobuf wire format).
     * @param {jspb.ByteSource} bytes The bytes to deserialize.
     * @return {!UpdateSettingContract}
     */
    deserializeBinary(bytes: any): any;
    /**
     * Deserializes binary data (in protobuf wire format) from the
     * given reader into the given message object.
     * @param {!UpdateSettingContract} msg The message object to deserialize into.
     * @param {!jspb.BinaryReader} reader The BinaryReader to use.
     * @return {!UpdateSettingContract}
     */
    deserializeBinaryFromReader(msg: any, reader: any): any;
    /**
     * Serializes the given message to binary data (in protobuf wire
     * format), writing to the given BinaryWriter.
     * @param {!UpdateSettingContract} message
     * @param {!jspb.BinaryWriter} writer
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    serializeBinaryToWriter(message: any, writer: any): void;
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
declare const UpdateEnergyLimitContract: {
    (opt_data: any): void;
    /**
     * @public
     * @override
     */
    displayName: string;
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Deprecated. Whether to include
     *     the JSPB instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!UpdateEnergyLimitContract} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    toObject(includeInstance: any, msg: any): {
        ownerAddress: any;
        contractAddress: any;
        originEnergyLimit: any;
    };
    /**
     * Deserializes binary data (in protobuf wire format).
     * @param {jspb.ByteSource} bytes The bytes to deserialize.
     * @return {!UpdateEnergyLimitContract}
     */
    deserializeBinary(bytes: any): any;
    /**
     * Deserializes binary data (in protobuf wire format) from the
     * given reader into the given message object.
     * @param {!UpdateEnergyLimitContract} msg The message object to deserialize into.
     * @param {!jspb.BinaryReader} reader The BinaryReader to use.
     * @return {!UpdateEnergyLimitContract}
     */
    deserializeBinaryFromReader(msg: any, reader: any): any;
    /**
     * Serializes the given message to binary data (in protobuf wire
     * format), writing to the given BinaryWriter.
     * @param {!UpdateEnergyLimitContract} message
     * @param {!jspb.BinaryWriter} writer
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    serializeBinaryToWriter(message: any, writer: any): void;
};
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
declare const SmartContractDataWrapper: {
    (opt_data: any): void;
    /**
     * @public
     * @override
     */
    displayName: string;
    /**
     * Static version of the {@see toObject} method.
     * @param {boolean|undefined} includeInstance Deprecated. Whether to include
     *     the JSPB instance for transitional soy proto support:
     *     http://goto/soy-param-migration
     * @param {!SmartContractDataWrapper} msg The msg instance to transform.
     * @return {!Object}
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    toObject(includeInstance: any, msg: any): {
        smartContract: any;
        runtimecode: any;
    };
    /**
     * Deserializes binary data (in protobuf wire format).
     * @param {jspb.ByteSource} bytes The bytes to deserialize.
     * @return {!SmartContractDataWrapper}
     */
    deserializeBinary(bytes: any): any;
    /**
     * Deserializes binary data (in protobuf wire format) from the
     * given reader into the given message object.
     * @param {!SmartContractDataWrapper} msg The message object to deserialize into.
     * @param {!jspb.BinaryReader} reader The BinaryReader to use.
     * @return {!SmartContractDataWrapper}
     */
    deserializeBinaryFromReader(msg: any, reader: any): any;
    /**
     * Serializes the given message to binary data (in protobuf wire
     * format), writing to the given BinaryWriter.
     * @param {!SmartContractDataWrapper} message
     * @param {!jspb.BinaryWriter} writer
     * @suppress {unusedLocalVariables} f is only used for nested messages
     */
    serializeBinaryToWriter(message: any, writer: any): void;
};
export { ClearABIContract, CreateSmartContract, SmartContract, SmartContractDataWrapper, TriggerSmartContract, UpdateEnergyLimitContract, UpdateSettingContract };
//# sourceMappingURL=smart_contract_pb.d.ts.map