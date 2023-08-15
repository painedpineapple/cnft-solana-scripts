import { exit } from "process";
import dotenv from "dotenv";
import { COMPRESSED_COLLECTION, wallet } from "./constants";
import { getAssets, getAssetsByGroup, getAssetsByOwner } from "./read-nfts";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { PROGRAM_ID as BUBBLEGUM_PROGRAM_ID } from "@metaplex-foundation/mpl-bubblegum";

dotenv.config();

const run = async () => {
  try {
    await getAssetsByGroup(COMPRESSED_COLLECTION.MINT.toString());
  } catch (error) {
    console.log(error);
  }

  exit();
};

run();
