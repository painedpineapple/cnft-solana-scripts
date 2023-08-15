import { exit } from "process";
import dotenv from "dotenv";
import { COMPRESSED_COLLECTION, connection, wallet } from "./constants";
import {
  getAssetProof,
  getAssets,
  getAssetsByGroup,
  getAssetsByOwner,
} from "./read-nfts";
import {
  AccountMeta,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import {
  createTransferInstruction,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  ConcurrentMerkleTreeAccount,
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";

dotenv.config();

const run = async () => {
  try {
    // const cNFTs = await getAssetsByGroup(COMPRESSED_COLLECTION.MINT.toString());
    const assets = await getAssets([
      "2iG7ynKzjKLFjHtBCXDe29czAmAbhhRgn6yG2GmRNXMt",
    ]);
    const asset = assets[0].result;
    const assetProof = await getAssetProof(asset.id);

    // retrieve the merkle tree's account from the blockchain
    const treeAccount = await ConcurrentMerkleTreeAccount.fromAccountAddress(
      connection,
      COMPRESSED_COLLECTION.TREE.pk
    );

    const treeAuthority = treeAccount.getAuthority();
    const canopyDepth = treeAccount.getCanopyDepth();

    // parse the list of proof addresses into a valid AccountMeta[]
    const proof: AccountMeta[] = assetProof.proof
      // remove the id's that are already part of the canopy
      .slice(0, assetProof.proof.length - (!!canopyDepth ? canopyDepth : 0))
      .map((node: string) => ({
        pubkey: new PublicKey(node),
        isSigner: false,
        isWritable: false,
      }));

    const transferIx = createTransferInstruction(
      {
        merkleTree: COMPRESSED_COLLECTION.TREE.pk,
        treeAuthority,
        leafOwner: wallet.publicKey,
        leafDelegate: wallet.publicKey,
        newLeafOwner: new PublicKey(
          "BypJbNiuwWyK2ettdE8mibzxVsVERU6K9Pe4ZBk8Yu1B"
        ),
        logWrapper: SPL_NOOP_PROGRAM_ID,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        anchorRemainingAccounts: proof,
      },
      {
        root: [...new PublicKey(assetProof.root.trim()).toBytes()],
        dataHash: [
          ...new PublicKey(asset.compression.data_hash.trim()).toBytes(),
        ],
        creatorHash: [
          ...new PublicKey(asset.compression.creator_hash.trim()).toBytes(),
        ],
        nonce: asset.compression.leaf_id,
        index: asset.compression.leaf_id,
      },
      BUBBLEGUM_PROGRAM_ID
    );

    const tx = new Transaction().add(transferIx);

    const txSignature = await sendAndConfirmTransaction(
      connection,
      tx,
      [wallet],
      {
        commitment: "confirmed",
        skipPreflight: true,
      }
    );

    console.log({ txSignature });
  } catch (error) {
    console.log(error);
  }

  exit();
};

run();
