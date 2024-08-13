<script setup>
import { openTransportReplayer, RecordStore } from '@ledgerhq/hw-transport-mocker';
import Trx from '@ledgerhq/hw-app-trx';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TronWeb from 'tronweb';
import { tronweb } from './tronweb';
window.TronWeb = TronWeb;
window.Trx = Trx;
window.TransportWebHID = TransportWebHID;
const TRC20TokenContractAddress = 'TBFomoujFqse6megmarBS3FYAw4chnJbVu';
const pluginForSwapExactTokensForTokens = {
  payload: '11506c7567696e426f696c6572706c617465410e1bce983f78f8913002c3f7e52daf78de6da2cb38ed1739',
  signature:
    '304602210096f1b6e5e0fc8cdc7bf90b9edecbe9d0638714d4211d6baf18f66bdf685220c90221009f34a1fc88e0374b297d0c5d68493bce7951ac97302adac494ab9dae6cbd7f8c'
};

async function makeApp() {
  // const transport = await openTransportReplayer(
  //   RecordStore.fromString(`
  //   => e002000015058000002c800000c3800000000000000000000000
  //   <= 41040357bda0e415396eab766d392d5b996eb4a0bec6ccbb166d581341ebb50ebb54c30b365823884d8169e4c784373f0d3b871f3d16bca0b33a292d98f6cf07855a225457646e57427a4664425031623873715a3552634644626b563373426d6e787359759000
  //   `)
  // );
  const transport = await TransportWebHID.create();
  const app = new Trx(transport);
  const path = `44'/195'/${0}'/0/0`;
  const address = await app.getAddress(path);
  return { transport, path, app, address };
}

async function handleSign() {
  console.log('使用默认的 plugin 解析服务');
  const { transport, app, path, address } = await makeApp();
  console.log('Your address is: ', address);
  // const functionSelector = "transfer(address,uint256)";
  // const params = [
  //   { type: "address", value: "TZ6iaSwA1rGfwWoaRDrxfQ7vmGZ1yA5NVi" },
  //   { type: "uint256", value: "100" }
  // ];
  const functionSelector = 'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)';
  const params = [
    { type: 'uint256', value: '3575380138531460659227' },
    { type: 'uint256', value: '3575380138531460659227' },
    { type: 'address[]', value: ['TZ6iaSwA1rGfwWoaRDrxfQ7vmGZ1yA5NVi'] },
    { type: 'address', value: 'THvMiWQeVPGEMuBtAnuKn2QpuSjqjrGQGu' },
    { type: 'uint256', value: '1629366781' }
  ];
  const { transaction } = await tronweb.transactionBuilder.triggerSmartContract(
    TRC20TokenContractAddress,
    functionSelector,
    {
      feeLimit: 1e7,
      permissionId: 100
    },
    params,
    address.address
  );
  const nexTxn = await tronweb.transactionBuilder.addUpdateData(
    transaction,
    'test1testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttetesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttess'
  );
  console.log(nexTxn);

  app.setLoadConfig({
    pluginBaseURL: 'http://localhost:3333'
  });
  const signature = await app.signTransaction(path, nexTxn.raw_data_hex);
  console.log('Signed signature: ', signature);
  await (transport == null ? void 0 : transport.close());
  nexTxn.signature = [signature];
  const result = await tronweb.trx.sendRawTransaction(nexTxn);
  console.log('broadcast result : ', result);
}

async function handleSignWithoutPlugin() {
  console.log('使用默认的 plugin 解析服务,但是没有相关的插件信息');
  const { transport, app, path, address } = await makeApp();
  const functionSelector = 'transfer(address,uint256)';
  const params = [
    { type: 'address', value: 'THvMiWQeVPGEMuBtAnuKn2QpuSjqjrGQGu' },
    { type: 'uint256', value: '10' }
  ];
  const { transaction } = await tronweb.transactionBuilder.triggerSmartContract(
    TRC20TokenContractAddress,
    functionSelector,
    {
      feeLimit: 1e7,
      permissionId: 100
    },
    params,
    address.address
  );
  console.log(transaction);

  app.setLoadConfig({
    pluginBaseURL: 'http://localhost:3333'
  });
  const signature = await app.signTransaction(path, transaction.raw_data_hex);
  console.log('Signed signature: ', signature);
  await (transport == null ? void 0 : transport.close());
  transaction.signature = [signature];
  const result = await tronweb.trx.sendRawTransaction(transaction);
  console.log('broadcast result : ', result);
}

async function handleSignWithResolution() {
  console.log('提供 resolution');
  const { transport, app, path, address } = await makeApp();
  const functionSelector = 'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)';
  const params = [
    { type: 'uint256', value: '3575380138531460659227' },
    { type: 'uint256', value: '3575380138531460659227' },
    { type: 'address[]', value: ['TZ6iaSwA1rGfwWoaRDrxfQ7vmGZ1yA5NVi'] },
    { type: 'address', value: 'THvMiWQeVPGEMuBtAnuKn2QpuSjqjrGQGu' },
    { type: 'uint256', value: '1629366781' }
  ];
  const { transaction } = await tronweb.transactionBuilder.triggerSmartContract(
    TRC20TokenContractAddress,
    functionSelector,
    {
      feeLimit: 1e7,
      permissionId: 100
    },
    params,
    address.address
  );
  console.log(transaction);

  const signature = await app.signTransaction(path, transaction.raw_data_hex, [], {
    externalPlugin: [pluginForSwapExactTokensForTokens]
  });
  console.log('Signed signature: ', signature);
  await (transport == null ? void 0 : transport.close());
  signature.signature = [signature];
  const result = await tronweb.trx.sendRawTransaction(signature);
  console.log('broadcast result : ', result);
}

async function handleSignNotSmartContract() {
  console.log('签名非智能合约');
  const { transport, app, path, address } = await makeApp();
  const transaction = await tronweb.transactionBuilder.sendTrx(
    'THvMiWQeVPGEMuBtAnuKn2QpuSjqjrGQGu',
    10,
    address.address
  );
  const signature = await app.signTransaction(path, transaction.raw_data_hex, [], {
    externalPlugin: [pluginForSwapExactTokensForTokens]
  });
  await (transport == null ? void 0 : transport.close());
  signature.signature = [signature];
  const result = await tronweb.trx.sendRawTransaction(signature);
  console.log('broadcast result : ', result);
}

async function handleClearSign() {
  console.log('使用clearSign');
  const { transport, app, path, address } = await makeApp();
  console.log('Your address is: ', address);
  const functionSelector = 'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)';
  const params = [
    { type: 'uint256', value: '3575380138531460659227' },
    { type: 'uint256', value: '3575380138531460659227' },
    { type: 'address[]', value: ['TZ6iaSwA1rGfwWoaRDrxfQ7vmGZ1yA5NVi'] },
    { type: 'address', value: 'THvMiWQeVPGEMuBtAnuKn2QpuSjqjrGQGu' },
    { type: 'uint256', value: '1629366781' }
  ];
  const { transaction } = await tronweb.transactionBuilder.triggerSmartContract(
    TRC20TokenContractAddress,
    functionSelector,
    {
      feeLimit: 1e7,
      permissionId: 100
    },
    params,
    address.address
  );
  const nexTxn = await tronweb.transactionBuilder.addUpdateData(
    transaction,
    'test1testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttetesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttess'
  );
  // console.log(JSON.stringify(nexTxn));

  app.setLoadConfig({
    pluginBaseURL: 'http://localhost:3333'
  });
  const signature = await app.clearSignTransaction(path, nexTxn.raw_data_hex);
  console.log('Signed signature: ', signature);
  await (transport == null ? void 0 : transport.close());
  nexTxn.signature = [signature];
  const result = await tronweb.trx.sendRawTransaction(nexTxn);
  console.log('broadcast result : ', result);
}

async function handleSetExternalPlugin() {
  const transport = await TransportWebHID.create();
  const app = new Trx(transport);
  const path = `44'/195'/${0}'/0/0`;
  const address = await app.getAddress(path);
  console.log('Your address is: ', address);
  const result2 = await app.setExternalPlugin(
    '11506c7567696e426f696c6572706c617465410e1bce983f78f8913002c3f7e52daf78de6da2cba9059cbb',
    '3045022100c6ed1e65f3c1a58fff2348c90e5945ae419e946f71142be6a5210333dd1d8ea7022010cdcf93e2895087194961c360ef24847c5c2c4c1956b02ece931fa4aed174ec'
  );
  console.log('setExternal Plugin result: ', result2);
}
</script>

<template>
  <div>
    <button @click="handleSign">signTransaction with valid plugin service</button>
    <button @click="handleSignWithoutPlugin">signTransaction without invalid plugin service</button>
    <button @click="handleSignWithResolution">signTransaction with resolution</button>
    <button @click="handleSignNotSmartContract">sign a not TriggerSmartContract Transaction with resolution</button>
    <button @click="handleClearSign">clearSignTransaction</button>
    <button @click="handleSetExternalPlugin">setExternalPlugin</button>
  </div>
</template>

<style scoped></style>
