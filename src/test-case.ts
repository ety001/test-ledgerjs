export const case_1 = {
  domain: {
    chainId: 69,
    name: 'Da Domain',
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    version: '1'
  },
  types: {
    'EIP712Domain': [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ],
    'Test': [{ name: 'contents', type: 'string' }]
  },
  primaryType: 'Test',
  message: { contents: 'Hello, Bob!' }
}
