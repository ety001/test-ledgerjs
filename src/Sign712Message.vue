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

async function handleSignEIP712Message() {
  const message = {
    'domain': {
      'chainId': 1151668124,
      'name': 'Advanced test',
      'verifyingContract': '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      'version': '1'
    },
    'message': {
      'with': '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      'token_send': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      'value_send': '24500000000000000000',
      'token_recv': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      'value_recv': '10000000000000000',
      'expires': 1714559400
    },
    'primaryType': 'Transfer',
    'types': {
      'EIP712Domain': [
        {
          'name': 'name',
          'type': 'string'
        },
        {
          'name': 'version',
          'type': 'string'
        },
        {
          'name': 'chainId',
          'type': 'uint256'
        },
        {
          'name': 'verifyingContract',
          'type': 'address'
        }
      ],
      'Transfer': [
        {
          'name': 'with',
          'type': 'address'
        },
        {
          'name': 'token_send',
          'type': 'address'
        },
        {
          'name': 'value_send',
          'type': 'uint256'
        },
        {
          'name': 'token_recv',
          'type': 'address'
        },
        {
          'name': 'value_recv',
          'type': 'uint256'
        },
        {
          'name': 'expires',
          'type': 'uint64'
        }
      ]
    }
  };

  const { app, path } = await makeApp();
  const result = await app.signTIP712Message(path, message);
  console.log('Sign 712 Message Result : ', result);
}

</script>

<template>
  <div style="width: 540px; display: flex; flex-wrap: wrap">
    <div style="margin-bottom: 10px">
      <button @click="handleSignEIP712Message">Sign 712 Message</button>
    </div>
  </div>
</template>

<style scoped></style>
