import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

export const RPC_HOST = "https://devnet.helius-rpc.com/?api-key=<API_KEY>";

export const connection = new Connection(RPC_HOST, "confirmed");

export const wallet = Keypair.fromSeed(
  Uint8Array.from(JSON.parse(process.env.WALLET_PRIVATE_KEY || "").slice(0, 32))
);

// collection mint: https://explorer.solana.com/address/9ARuuSVb9sWvn3j37dkpRg761GHBEoyY6jPidhyqwvN8?cluster=devnet
export const COMPRESSED_COLLECTION = {
  MINT: new PublicKey("9ARuuSVb9sWvn3j37dkpRg761GHBEoyY6jPidhyqwvN8"),
  MINT_AUTHORITY: new PublicKey("DvUGZuHZefmjCqBF5B5hcbdBSb7hCZ4F6RhmYwkjnZzU"),
  FREEZE_AUTHORITY: new PublicKey(
    "DvUGZuHZefmjCqBF5B5hcbdBSb7hCZ4F6RhmYwkjnZzU"
  ),
  METADATA_ADDRESS: new PublicKey(
    "B93gJxDcMnsppxxUdNXEz7v1fUuQ8QLp4CyTdb73HfZk"
  ),
  TREE: {
    // mint tx: https://solscan.io/tx/5JsY7y1S8awuyGQxwdmcp3CfHfSsGbBmHmXGxxrQpqV8UmyYdCdXhuPSZ78S5L3kPVEv7Abu4zZidefKmoForoN5?cluster=devnet
    pk: new PublicKey("DUafw4MY45R3W83w6fQNRv5Axo29Y36hU87jAMEmoXdf"),
  },
  // cNFT Mints
  // #1: 2U8WnU6xGpFRLB59pDgDFezs1dDQgW7aoeP9h3LcGL7eYk4NbwPbHdXiyDnA5UqnY2MvNFho8AbiAYjbcUxXEPo4
  // #2: 2rxTXQ89XSaU5wZC2WdR9MfT5e9WmGDkbNumzjmziP2JSQx9tEwA27SBBQ5tDKP7P77dB65pTi4FoNwcM6f9XWu1
  // #3: 5sDKTYNuoG6CNyKpw1ouvtLJGZH6h7yC2BvMPGBLQchgkstxzNkvoTqtb3WSxhh925Q49VQpVaZ7vJm9he2JE6sE
  // #4: 57ikfmEaZhsju5g9kjDWdekfQBdvb6TmtBmWrH41FoSULxosHLA1JBz95JJPy8EeJzDxdKvdU1edyXrHnrmauQnh

  // xFer cNFT sx: 3b8rX33t3VU9mRa1JkrcBLVyDK8Z2vUipHca5D9M6dYg7THLtgPx6p9BM2oPfUqM19NQddQHWx5oaxeqRdxzWmZU
  // Burn cNFT sx: 4MMquKURbnHJqmk2cBk97vjisdUa6zanSiQjnX4nBSXsT8r3Q4Dj7r2YHp4uExVo73n3EX4xNkxcLvoqAhQRomZB
};
