import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from "@metaplex-foundation/js";
import { exit } from "process";
import dotenv from "dotenv";
import { connection, RPC_HOST, wallet } from "./constants";
import { mintCollection, uploadImage, uploadMetadata } from "./utils";

dotenv.config();

const CONFIG = {
  uploadPath: `${__dirname}/assets/`,
  imgFileName: "pineapple.gif",
  imgType: "image/jpg",
  imgName: "Groovy Pineapple",
  description: "",
  attributes: [],
  sellerFeeBasisPoints: 0,
  symbol: "PINEC",
  creators: [{ address: wallet.publicKey, share: 0 }],
};

const run = async () => {
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: RPC_HOST,
        timeout: 60000,
      })
    );

  const imgUri = await uploadImage(
    metaplex,
    CONFIG.uploadPath,
    CONFIG.imgFileName
  );

  const metadataUri = await uploadMetadata(
    metaplex,
    imgUri,
    CONFIG.imgType,
    CONFIG.imgName,
    CONFIG.description,
    CONFIG.attributes
  );

  await mintCollection(
    metaplex,
    metadataUri,
    CONFIG.imgName,
    CONFIG.sellerFeeBasisPoints,
    CONFIG.symbol,
    CONFIG.creators
  );

  exit();
};

run();
