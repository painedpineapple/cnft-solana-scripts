import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
} from "@metaplex-foundation/js";
import * as fs from "fs";
import { exit } from "process";
import dotenv from "dotenv";
import { connection, RPC_HOST, wallet } from "./constants";
import {
  createAllocTreeIx,
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
  ValidDepthSizePair,
} from "@solana/spl-account-compression";
import {
  createCreateTreeInstruction,
  PROGRAM_ID as BUBBLE_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";

const maxDepthSizePair: ValidDepthSizePair = {
  maxDepth: 14,
  maxBufferSize: 64,
};

const canopyDepth = 10;

const treeKeypair = Keypair.generate();

const run = async () => {
  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [treeKeypair.publicKey.toBuffer()],
    BUBBLE_PROGRAM_ID
  );

  console.log({
    treePubkey: treeKeypair.publicKey.toString(),
    treePrivateKey: treeKeypair.secretKey,
  });

  const allocTreeIx = await createAllocTreeIx(
    connection,
    treeKeypair.publicKey,
    wallet.publicKey,
    maxDepthSizePair,
    canopyDepth
  );

  const createTreeIx = createCreateTreeInstruction(
    {
      payer: wallet.publicKey,
      treeCreator: wallet.publicKey,
      treeAuthority,
      merkleTree: treeKeypair.publicKey,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
    },
    {
      maxBufferSize: maxDepthSizePair.maxBufferSize,
      maxDepth: maxDepthSizePair.maxDepth,
      public: false,
    },
    BUBBLE_PROGRAM_ID
  );

  const tx = new Transaction().add(allocTreeIx).add(createTreeIx);
  tx.feePayer = wallet.publicKey;

  const sx = await sendAndConfirmTransaction(
    connection,
    tx,
    [treeKeypair, wallet],
    { commitment: "confirmed", skipPreflight: true }
  );

  console.log(sx);

  exit();
};

run();
