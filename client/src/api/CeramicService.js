import CeramicClient from "@ceramicnetwork/http-client";
import KeyDidResolver from "key-did-resolver";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import { DID } from "dids";
import { IDX } from "@ceramicstudio/idx";
import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect";

const CERAMIC_API_URL = "https://ceramic-clay.3boxlabs.com";

const ceramicClient = new CeramicClient(CERAMIC_API_URL);
const resolver = {
  ...KeyDidResolver.getResolver(),
  ...ThreeIdResolver.getResolver(ceramicClient),
};
const did = new DID({ resolver });
ceramicClient.did = did;

export const ceramic = ceramicClient;

export const threeIdAuthenticate = async (ethereum, account) => {
  const threeIdConnect = new ThreeIdConnect();
  const authProvider = new EthereumAuthProvider(ethereum, account);
  await threeIdConnect.connect(authProvider);
  const provider = await threeIdConnect.getDidProvider();
  ceramic.did.setProvider(provider);
  await ceramic.did.authenticate();
  const idx = new IDX({ ceramic });
  return idx
};