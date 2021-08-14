import CeramicClient from "@ceramicnetwork/http-client";
import KeyDidResolver from "key-did-resolver";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import { DID } from "dids";
import { IDX } from "@ceramicstudio/idx";
import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect";
import { TileDocument } from "@ceramicnetwork/stream-tile";
const globals = require("../global.json");

const CERAMIC_API_URL = "https://ceramic-clay.3boxlabs.com";

const ceramicClient = new CeramicClient(CERAMIC_API_URL);
const resolver = {
  ...KeyDidResolver.getResolver(),
  ...ThreeIdResolver.getResolver(ceramicClient),
};
const did = new DID({ resolver });

export const ceramic = ceramicClient;

export const defaultAuthenticate = async () => {
  // await did.authenticate();
  // await ceramic.setDID(did);
  const idx = new IDX({ ceramic });
  return idx;
};

export const threeIdAuthenticate = async (ethereum, account) => {
  const threeIdConnect = new ThreeIdConnect();
  const authProvider = new EthereumAuthProvider(ethereum, account);
  await threeIdConnect.connect(authProvider);
  const provider = await threeIdConnect.getDidProvider();
  await ceramic.setDID(did);
  ceramic.did.setProvider(provider);
  await ceramic.did.authenticate();
  const idx = new IDX({ ceramic });
  console.log(await idx.get("cryptoAccounts"));
  return idx;
};

export const createEntity = async (name, description, uri) => {
  let authorID = ceramic.did.id;
  console.log(name, description, uri);
  let newEntity = await TileDocument.create(
    ceramic,
    { name, description, uri },
    {
      controllers: [authorID],
      family: "Entity",
      schema: globals.ceramicSchemas.EntitySchema,
    }
  );
  return newEntity.id.toString();
};

export const updateEntity = async (entityStreamId, name, description, uri) => {
  let authorID = ceramic.did.id;
  console.log(name, description, uri);
  let entity = await ceramic.loadStream(entityStreamId);
  await entity.update({ name, description, uri });
};

export const createReview = async (type, texts) => {
  let authorID = ceramic.did.id;
  let newReview = await TileDocument.create(
    ceramic,
    { type, texts },
    {
      controllers: [authorID],
      family: "Entity",
      schema: globals.ceramicSchemas.ReviewSchema,
    }
  );
  return newReview.commitId.toString(); // We retrieve commitId because we do not track future edits for reviews
};

export const updateEntitySchema = async () => {
  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "ProjectEntity",
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      uri: { type: "string" },
    },
    required: ["name", "description", "uri"],
  };
  const metadata = {
    controllers: [ceramic.did.id],
  };
  const schemaInstance = await TileDocument.create(ceramic, schema, metadata);
  console.log("EntitySchema", schemaInstance.commitId.toString());
};

export const updateReviewSchema = async () => {
  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "ProjectEntity",
    type: "object",
    properties: {
      type: { type: "string" },
      texts: { type: "string" },
    },
    required: ["type", "texts"],
  };
  const metadata = {
    controllers: [ceramic.did.id],
  };
  const schemaInstance = await TileDocument.create(ceramic, schema, metadata);
  console.log("ReviewSchema", schemaInstance.commitId.toString());
};
