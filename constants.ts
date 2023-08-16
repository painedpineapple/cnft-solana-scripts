import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

export const RPC_HOST = "https://devnet.helius-rpc.com/?api-key=<API_KEY>";

export const connection = new Connection(RPC_HOST, "confirmed");

export const wallet = Keypair.fromSeed(
  Uint8Array.from(JSON.parse(process.env.WALLET_PRIVATE_KEY || "").slice(0, 32))
);

export const COMPRESSED_COLLECTION = {
  MINT: new PublicKey(""),
  MINT_AUTHORITY: new PublicKey(""),
  FREEZE_AUTHORITY: new PublicKey(""),
  METADATA_ADDRESS: new PublicKey(""),
  TREE: {
    pk: new PublicKey(""),
  },
};
