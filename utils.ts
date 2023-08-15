import { Metaplex, toMetaplexFile } from "@metaplex-foundation/js";
import * as fs from "fs";
import { PublicKey } from "@solana/web3.js";
import { wallet } from "./constants";

export async function uploadImage(
  metaplex: Metaplex,
  filePath: string,
  fileName: string
): Promise<string> {
  console.log(`Step 1 - Uploading Image`);
  const imgBuffer = fs.readFileSync(filePath + fileName);
  const imgMetaplexFile = toMetaplexFile(imgBuffer, fileName);
  const imgUri = await metaplex.storage().upload(imgMetaplexFile);
  console.log(`Image URI:`, imgUri);
  return imgUri;
}

export async function uploadMetadata(
  metaplex: Metaplex,
  imgUri: string,
  imgType: string,
  nftName: string,
  description: string,
  attributes: { trait_type: string; value: string }[]
) {
  console.log(`Step 2 - Uploading Metadata`);

  const { uri } = await metaplex.nfts().uploadMetadata({
    name: nftName,
    description: description,
    image: imgUri,
    attributes: attributes,
    properties: {
      files: [
        {
          type: imgType,
          uri: imgUri,
        },
      ],
    },
  });
  console.log("   Metadata URI:", uri);
  return uri;
}

export async function mintNft(
  metaplex: Metaplex,
  metadataUri: string,
  name: string,
  sellerFee: number,
  symbol: string,
  creators: { address: PublicKey; share: number }[],
  collection?: PublicKey
) {
  console.log(`Step 3 - Minting Collection`);

  const { nft } = await metaplex.nfts().create({
    uri: metadataUri,
    name: name,
    sellerFeeBasisPoints: sellerFee,
    symbol: symbol,
    creators: creators,
    isMutable: false,
    updateAuthority: wallet,
    collection,
  });
  console.log(` Collection NFT`, JSON.stringify(nft, null, 2));
  console.log(`   Success!🎉`);
  console.log(
    `   Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`
  );
}

export async function mintCollection(
  metaplex: Metaplex,
  metadataUri: string,
  name: string,
  sellerFee: number,
  symbol: string,
  creators: { address: PublicKey; share: number }[]
) {
  console.log(`Step 3 - Minting Collection`);

  const { nft } = await metaplex.nfts().create({
    uri: metadataUri,
    name: name,
    sellerFeeBasisPoints: sellerFee,
    isCollection: true,
    updateAuthority: wallet,
  });
  console.log(` Collection NFT`, JSON.stringify(nft, null, 2));
  console.log(`   Success!🎉`);
  console.log(
    `   Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`
  );
}
