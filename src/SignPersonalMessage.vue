<script setup>
import Trx from '@ledgerhq/hw-app-trx';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TronWeb from 'tronweb';
import { tronweb } from './tronweb';
window.TronWeb = TronWeb;
window.Trx = Trx;
window.TransportWebHID = TransportWebHID;

async function makeApp() {
  const transport = await TransportWebHID.create();
  const app = new Trx(transport);
  const path = `44'/195'/${0}'/0/0`;
  const address = await app.getAddress(path);
  return { transport, path, app, address };
}

async function handleSignPersonalMessage() {
  const message1 = document.getElementById('message1').value;
  console.log('Sign Personal Message');
  console.log(Buffer.from(message1).toString("hex"))
  const { app, path } = await makeApp();
  const result = await app.signPersonalMessage(
    path,
    Buffer.from(message1).toString("hex")
  );
  console.log('Sign PersonalMessage Result : ', result);
}


async function handleSignPersonalMessageV2() {
  const message2 = document.getElementById('message2').value;
  console.log('Sign Personal Message V2');
  console.log(Buffer.from(message2).toString("hex"))
  const { app, path } = await makeApp();
  const result = await app.signPersonalMessageV2(
    path,
    Buffer.from(message2).toString("hex")
  );
  console.log('Sign PersonalMessage V2 Result : ', result);
}


</script>

<template>
  <div style="width:500px; display: flex; flex-wrap: wrap;">
    <div style="margin-bottom:10px">
      <input id="message1" type="text" style="height: 32px; width: 200px; margin-right: 20px" />
      <button @click="handleSignPersonalMessage">Sign Personal Message</button>
    </div>
    <div>
      <input id="message2" type="text" style="height: 32px; width: 200px; margin-right: 20px" />
      <button @click="handleSignPersonalMessageV2">Sign Personal Message V2</button>
    </div>
  </div>
</template>

<style scoped></style>
