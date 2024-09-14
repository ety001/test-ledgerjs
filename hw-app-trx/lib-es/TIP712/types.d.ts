/// <reference types="node" />
export type TIP712MessageDomain = Partial<{
    name: string;
    chainId: number;
    version: string;
    verifyingContract: string;
    salt: string;
}>;
export type TIP712MessageTypesEntry = {
    name: string;
    type: string;
};
export type TIP712MessageTypes = {
    EIP712Domain: TIP712MessageTypesEntry[];
    [key: string]: TIP712MessageTypesEntry[];
};
export type TIP712Message = {
    domain: TIP712MessageDomain;
    types: TIP712MessageTypes;
    primaryType: string;
    message: Record<string, unknown>;
};
export type LoadConfig = {
    nftExplorerBaseURL?: string | null;
    pluginBaseURL?: string | null;
    extraPlugins?: any | null;
    cryptoassetsBaseURL?: string | null;
    calServiceURL?: string | null;
};
export type FieldFiltersV1 = {
    label: string;
    path: string;
    signature: string;
    format?: never;
    coin_ref?: never;
};
export type FieldFiltersV2 = {
    format: "raw" | "token" | "amount" | "datetime";
    label: string;
    path: string;
    signature: string;
} & ({
    format: "raw" | "datetime";
    coin_ref?: never;
} | {
    format: "token" | "amount";
    coin_ref: number;
});
export type MessageFilters = {
    contractName: {
        label: string;
        signature: string;
    };
    fields: FieldFiltersV1[] | FieldFiltersV2[];
};
export type CALServiceTIP712Response = {
    tip712_signatures: {
        [contractAddress: string]: {
            [schemaHash: string]: MessageFilters;
        };
    };
}[];
export type StructImplemData = Required<{
    structType: "root";
    value: string;
} | {
    structType: "array";
    value: number;
} | {
    structType: "field";
    value: Required<{
        data: unknown;
        type: string;
        sizeInBits: number | undefined;
    }>;
}>;
export type StructDefData = Required<{
    structType: "name";
    value: string;
} | {
    structType: "field";
    value: Buffer;
}>;
export type FilteringInfoShowField = {
    displayName: string;
    sig: string;
    filtersCount?: never;
    chainId: number;
    erc20SignaturesBlob: string | null | undefined;
    format: "raw" | "token" | "amount" | "datetime" | undefined;
    coinRef: number | undefined;
    shouldUseV1Filters: boolean | undefined;
    coinRefsTokensMap: Record<number, {
        token: string;
        deviceTokenIndex?: number;
    }>;
};
export type FilteringInfoContractName = {
    displayName: string;
    sig: string;
    filtersCount: number;
};
//# sourceMappingURL=types.d.ts.map