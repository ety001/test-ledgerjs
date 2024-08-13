<script setup lang="ts">
import Eth from '@ledgerhq/hw-app-eth';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TronWeb from 'tronweb';
import { case_1 } from './test-case';
import { ref } from 'vue';
import caseList from './tip712cases.json';
// @ts-expect-error
window.TronWeb = TronWeb;
// @ts-expect-error
window.Trx = Eth;
// @ts-expect-error
window.TransportWebHID = TransportWebHID;

async function makeApp() {
  const transport = await TransportWebHID.create();
  const app = new Eth(transport);
  // change your path
  const path = `44'/60'/0'/0/0`;
  // get address
  const address = await app.getAddress(path);
  console.log('Your address is: ', address);
  return { transport, app, path, address };
}

async function handleSign() {
  const { transport, app, path } = await makeApp();

  // request Ledger to sign TIP712HashedMessage
  const signature = await app.signEIP712Message(path, case_1);
  console.log('Signed signature: ', signature);
  await transport?.close();
}
async function handleSignWithfullImplem() {
  const { transport, app, path } = await makeApp();

  // request Ledger to sign TIP712HashedMessage
  const signature = await app.signEIP712Message(path, case_1, true);
  console.log('Signed signature: ', signature);
  await transport?.close();
}

const index = ref(0);
async function handleSignTestCase() {
  console.log('to be signed', caseList[index.value]);
  const { transport, app, path } = await makeApp();

  // request Ledger to sign TIP712HashedMessage
  const signature = await app.signEIP712Message(path, caseList[index.value], false);
  console.log('Signed signature: ', signature);
  await transport?.close();
}

async function signWithTronLink() {
  const domain = {
    name: 'TrcToken Test',
    version: '1',
    chainId: '0xd698d4192c56cb6be724a558448e2684802de4d6cd8690dc',
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
  };

  // The named list of all type definitions
  const types = {
    FromPerson: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' },
      { name: 'trcTokenId', type: 'trcToken' }
    ],
    ToPerson: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' },
      { name: 'trcTokenArr', type: 'trcToken[]' }
    ],
    Mail: [
      { name: 'from', type: 'FromPerson' },
      { name: 'to', type: 'ToPerson' },
      { name: 'contents', type: 'string' },
      { name: 'tAddr', type: 'address[]' },
      { name: 'trcTokenId', type: 'trcToken' },
      { name: 'trcTokenArr', type: 'trcToken[]' }
    ]
  };

  // The data to sign
  const value = {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      trcTokenId: '1002000'
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      trcTokenArr: ['1002000', '1002000']
    },
    contents: 'Hello, Bob!',
    tAddr: ['0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB', '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'],
    trcTokenId: '1002000',
    trcTokenArr: ['1002000', '1002000']
  };
  const address = await window.tron?.request({ method: 'eth_requestAccounts' });
  console.log('address: ', address);
  const res = await window.tronWeb.trx._signTypedData(domain, types, value);
}
</script>

<template>
  <div>
    <button @click="handleSign">sign ETH with TIP712Message</button>
    <button @click="handleSignWithfullImplem">sign ETH with TIP712Message withfullImplem: true</button>
    <button @click="signWithTronLink">signWithTronLink</button>

    <h2>Test Cases</h2>
    <div :style="{ display: 'flex' }">
      输入测试用例的序号(最大 {{ caseList.length - 1 }}):<input
        type="number"
        v-model="index"
        min="0"
        :max="caseList.length - 1"
      />
    </div>
    <button @click="handleSignTestCase">sign TIP712 message with index: {{ index }}</button>
  </div>
</template>

<style scoped></style>
