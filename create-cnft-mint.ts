import {
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import {
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  TokenProgramVersion,
  TokenStandard,
} from "@metaplex-foundation/mpl-bubblegum";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

import { exit } from "process";
import dotenv from "dotenv";
import {
  COMPRESSED_COLLECTION,
  connection,
  RPC_HOST,
  wallet,
} from "./constants";
import { mintNft, uploadImage, uploadMetadata } from "./utils";
import { createMintToCollectionV1Instruction } from "@metaplex-foundation/mpl-bubblegum";
import {
  bundlrStorage,
  keypairIdentity,
  Metaplex,
} from "@metaplex-foundation/js";

dotenv.config();

const CONFIG = {
  uploadPath: `${__dirname}/assets/`,
  imgFileName: "punapple.jpeg",
  imgType: "image/jpg",
  imgName: "Punapple",
  description: "PINECC#4",
  attributes: [
    { trait_type: "Background", value: "yellow" },
    {
      trait_type: "Foreground",
      value: "green",
    },
    {
      trait_type: "Glasses",
      value: "blue",
    },
  ],
  sellerFeeBasisPoints: 0,
  symbol: "PINECC#4",
  creators: [{ address: wallet.publicKey, share: 100 }],
};

const run = async () => {
  try {
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

    const receiver = wallet.publicKey;

    // derive the tree's authority (PDA), owned by Bubblegum
    const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
      [COMPRESSED_COLLECTION.TREE.pk.toBuffer()],
      BUBBLEGUM_PROGRAM_ID
    );

    // derive a PDA (owned by Bubblegum) to act as the signer of the compressed minting
    const [bubblegumSigner, _bump2] = PublicKey.findProgramAddressSync(
      // `collection_cpi` is a custom prefix required by the Bubblegum program
      [Buffer.from("collection_cpi", "utf8")],
      BUBBLEGUM_PROGRAM_ID
    );

    const [editionAccount, _bump3] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata", "utf8"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        COMPRESSED_COLLECTION.MINT.toBuffer(),
        Buffer.from("edition", "utf8"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const ixParams = {
      payer: wallet.publicKey,
      merkleTree: COMPRESSED_COLLECTION.TREE.pk,
      treeAuthority,
      treeDelegate: wallet.publicKey,

      // set the receiver of the NFT
      leafOwner: receiver,
      // set a delegated authority over this NFT
      leafDelegate: wallet.publicKey,

      // collection details
      collectionAuthority: wallet.publicKey,
      collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
      collectionMint: COMPRESSED_COLLECTION.MINT,
      collectionMetadata: COMPRESSED_COLLECTION.METADATA_ADDRESS,
      editionAccount,

      // other accounts,
      bubblegumSigner,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    };

    const ix = createMintToCollectionV1Instruction(ixParams, {
      metadataArgs: {
        name: "PineappleJuice#1",
        symbol: "PINECC",
        uri: metadataUri,
        sellerFeeBasisPoints: 0,
        primarySaleHappened: false,
        isMutable: false,
        creators: [],
        uses: null,
        tokenStandard: TokenStandard.NonFungible,
        editionNonce: 0,
        tokenProgramVersion: TokenProgramVersion.Original,
        collection: {
          key: COMPRESSED_COLLECTION.MINT,
          verified: false,
        },
      },
    });

    console.log({ ix });

    const tx = new Transaction().add(ix);
    tx.feePayer = wallet.publicKey;

    // send the transaction to the cluster
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
