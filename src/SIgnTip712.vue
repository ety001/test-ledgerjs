<script setup>
import Trx from '@ledgerhq/hw-app-trx';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TronWeb from 'tronweb';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapter-tronlink';
window.TronWeb = TronWeb;
window.Trx = Trx;
window.TransportWebHID = TransportWebHID;

// construct you typedData
// you can change the data to test other cases
const domain = {
  name: 'TRON Mail',
  version: '1',
  chainId: '0x2b6653dc',
  verifyingContract: 'TUe6BwpA7sVTDKaJQoia7FWZpC9sK8WM2t'
};

// The named list of all type definitions
const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' }
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' }
  ]
};

// The data to sign
const value = {
  from: {
    name: 'Cow',
    wallet: 'TUg28KYvCXWW81EqMUeZvCZmZw2BChk1HQ'
  },
  to: {
    name: 'Bob',
    wallet: 'TT5rFsXYCrnzdE2q1WdR9F2SuVY59A4hoM'
  },
  contents: 'Hello, Bob!'
};
const dominSeperator = TronWeb.utils._TypedDataEncoder.hashDomain(domain);
console.log('dominSeperator: ', dominSeperator);
const hashedMessage = TronWeb.utils._TypedDataEncoder.from(types).hash(value);
console.log('hashedMessage: ', hashedMessage);

async function handleSign() {
  const transport = await TransportWebHID.create();
  const app = new Trx(transport);
  // change your path
  const path = `44'/195'/${0}'/0/0`;
  // get address
  const address = await app.getAddress(path);
  console.log('Your address is: ', address);

  // request Ledger to sign TIP712HashedMessage
  const signature = await app.signTIP712HashedMessage(path, dominSeperator.slice(2), hashedMessage.slice(2));
  console.log('Signed signature: ', signature);
  await transport?.close();

  // verify signature
  const result = TronWeb.Trx.verifyTypedData(domain, types, value, signature, address.address);
  console.log('verify result: ', result);
}
async function handleSignWithTronLink() {
  const adapter = new TronLinkAdapter({ checkTimeout: 1000 });
  await adapter.connect();
  const signature = await window.tronWeb.trx._signTypedData(domain, types, value);
  console.log('Signed signature: ', signature);
  const result = TronWeb.Trx.verifyTypedData(domain, types, value, signature, adapter.address);
  console.log('verify result: ', result);
}
</script>

<template>
  <div>
    <button @click="handleSign">sign and verify</button>
    <button @click="handleSignWithTronLink">sign and verify With TronLink Ledger Account</button>
  </div>
</template>

<style scoped></style>
