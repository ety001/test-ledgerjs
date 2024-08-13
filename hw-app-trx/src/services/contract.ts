import bs58 from "bs58check";
import axios from "axios";
import { LedgerTrxTransactionResolution, LoadConfig } from "./types";
import TronProtobuf from '../protobuf/smart_contract_pb';
const { Transaction, TriggerSmartContract } = TronProtobuf;

type ContractMethod = {
  payload: string;
  signature: string;
  plugin: string;
}

export async function resolveTransaction(rawDataHex: string, loadConfig: LoadConfig): Promise<LedgerTrxTransactionResolution | null> {
  const contractInfo = parseContractInfoFromHex(rawDataHex);
  if (!contractInfo) {
    return null;
  }
  const resolution: LedgerTrxTransactionResolution = { externalPlugin: [] };

  const { contractAddress, selector } = contractInfo;
  const contractMethodInfos = await getPluginInfoForContractMethod(contractAddress, selector, loadConfig);
  if (contractMethodInfos) {
    const { payload, signature, plugin } = contractMethodInfos;
    if (plugin) {
      console.log(`[hw-app-trx]: found plugin (${plugin}) for select: ${selector}`);
      resolution.externalPlugin.push({ payload, signature })
    }
  } else {
    console.log("[hw-app-trx]: no infos for selector " + selector);
  }
  return resolution;
}


export async function getPluginInfoForContractMethod(contractAddress: string, selector: string, userLoadConfig: LoadConfig): Promise<ContractMethod | undefined> {

  const { pluginBaseURL, extraPlugins } = {
    pluginBaseURL: "https://cdn.live.ledger.com",
    extraPlugins: null,
    ...userLoadConfig,
  };

  let data = {};

  if (pluginBaseURL) {
    const url = `${pluginBaseURL}/plugins/tron.json`;
    data = await axios.get(url).then(r => r.data as any)
      .catch(e => {
        console.error(`[hw-app-trx]: could not fetch plugins from ${url}: ${String(e)}`);
        return undefined;
      })
  }
  if (extraPlugins) {
    data = { ...data, ...extraPlugins };
  }
  if (!data) return;

  const lcSelector = selector.toLowerCase();
  const lcContractAddress = contractAddress.toLowerCase();

  const contractSelectors = data[lcContractAddress];
  if (!!contractSelectors) {
    const plugin = contractSelectors[lcSelector];
    if (!!plugin) {
      return {
        payload: plugin['serialized_data'],
        signature: plugin['signature'],
        plugin: plugin['plugin'],
      }
    }
  }
}

export type TriggerSmartContractInfo = {
  contractAddress: string;
  selector: string;
}
const TriggerSmartContractType = 31;

export function parseContractInfoFromHex(rawTx: string): TriggerSmartContractInfo | undefined {
  try {
    const transaction = Transaction.raw.deserializeBinary(Uint8Array.from(Buffer.from(rawTx, 'hex')));
    const contract = transaction.getContractList()?.[0];
    if (!contract) { return; }
    const type = contract.getType();
    if (type !== TriggerSmartContractType) { return; }

    const value = contract.getParameter().getValue();
    const smartContract = TriggerSmartContract.deserializeBinary(value);
    const contractAddress = bs58.encode(smartContract.getContractAddress());
    const data = Buffer.from(smartContract.getData()).toString('hex');
    const selector = '0x' + data.slice(0, 8).toLowerCase();
    return { contractAddress, selector };
  } catch (e) {
    console.error(`[hw-app-trx]: failed to parse transaction from hex: ${String(e)}`);
  }
}

