<script setup>
// import AA from '../tron-protobuf/dist/google-protobuf';
// import Any from '../tron-protobuf/dist/any_pb';
import TronWeb, { utils } from 'tronweb';

import { tronweb } from './tronweb';

import TronProtobuf from '../tron-protobuf/dist/smart_contract_pb';
const { Transaction, TriggerSmartContract } = TronProtobuf;

console.log('+++++BB', TronProtobuf)
const rawDataHexToJson = (rawDataHex) => {
    const pb = Transaction.raw.deserializeBinary(utils.code.hexStr2byteArray(rawDataHex));
    console.log('rawDataHexToJson', pb.getContractList()[0].getParameter().getValue(), pb.toObject());
    const parameters = pb.getContractList()[0].getParameter();
    const ret = TriggerSmartContract.deserializeBinary(parameters.getValue());
    console.log('smartContract: ', ret.toObject());
    console.log('data: ', utils.code.byteArray2hexStr(ret.getData()));
    console.log('contractAddress: ', utils.code.byteArray2hexStr(ret.getContractAddress()));
    console.log('base58 address', tronweb.address.fromHex(utils.code.byteArray2hexStr(ret.getContractAddress())))
    return utils.code.byteArray2hexStr(ret.getContractAddress());
};
async function handleSign() {
  const TRC20TokenContractAddress = 'TBFomoujFqse6megmarBS3FYAw4chnJbVu';
  const functionSelector = 'transfer(address,uint256)';
  console.log(tronweb.sha3('transfer(address,uint256)'))
  const params = [
    { type: 'address', value: 'THvMiWQeVPGEMuBtAnuKn2QpuSjqjrGQGu' },
    { type: 'uint256', value: '10' }
  ];
  const { transaction } = await tronweb.transactionBuilder.triggerSmartContract(
    TRC20TokenContractAddress,
    functionSelector,
    {
      feeLimit: 10000000
    },
    params,
    'THvMiWQeVPGEMuBtAnuKn2QpuSjqjrGQGu'
  );
  // const transaction = await tronweb.transactionBuilder.sendTrx('TBFomoujFqse6megmarBS3FYAw4chnJbVu', 100, 'THvMiWQeVPGEMuBtAnuKn2QpuSjqjrGQGu');
  console.log(rawDataHexToJson(transaction.raw_data_hex));
}
</script>
<template>
  <div>
    <button @click="handleSign">sign and verify</button>
    <button>setExternalPlugin</button>
  </div>
</template>