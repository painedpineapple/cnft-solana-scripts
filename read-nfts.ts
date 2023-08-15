import { RPC_HOST } from "./constants";

// https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api/get-asset-proof
export const getAssetProof = async (id: string) => {
  const response = await fetch(RPC_HOST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAssetProof",
      params: {
        id,
      },
    }),
  });
  const { result } = await response.json();
  console.log("Assets Proof: ", result);
  return result;
};

// https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api/get-assets-by-owner
export const getAssetsByOwner = async (ownerAddress: string) => {
  const response = await fetch(RPC_HOST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAssetsByOwner",
      params: {
        ownerAddress,
        page: 1, // Starts at 1
        limit: 1000,
      },
    }),
  });
  const { result } = await response.json();
  console.log("Assets by Owner: ", result.items);
};

// https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api/get-assets-by-authority
export const getAssetsByAuthority = async (authorityAddress: string) => {
  const response = await fetch(RPC_HOST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAssetsByAuthority",
      params: {
        authorityAddress,
        page: 1, // Starts at 1
        limit: 1000,
      },
    }),
  });
  const { result } = await response.json();
  console.log("Assets by Authority: ", result.items);
  return result;
};

// https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api/get-assets-by-creator
export const getAssetsByCreator = async (creatorAddress: string) => {
  const response = await fetch(RPC_HOST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAssetsByCreator",
      params: {
        creatorAddress,
        onlyVerified: true,
        page: 1, // Starts at 1
        limit: 1000,
      },
    }),
  });
  const { result } = await response.json();
  console.log("Assets by Creator: ", result.items);
  return result;
};

// https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api/get-asset
export const getAssets = async (mintAddresses: string[]) => {
  let batch = mintAddresses.map((e, i) => ({
    jsonrpc: "2.0",
    id: `my-id-${i}`,
    method: "getAsset",
    params: {
      id: e,
    },
  }));
  const response = await fetch(RPC_HOST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(batch),
  });
  const result = await response.json();
  console.log("Assets: ", result);
  return result;
};

// https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api/get-assets-by-group
export const getAssetsByGroup = async (collectionMint: string) => {
  const response = await fetch(RPC_HOST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "getAssetsByGroup",
      params: {
        groupKey: "collection",
        groupValue: collectionMint,
        page: 1, // Starts at 1
        limit: 1000,
      },
    }),
  });
  const { result } = await response.json();
  console.log("Assets by Group: ", result.items);
  return result.items;
};

// https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api/search-assets
export const searchAssets = async (ownerAddress: string) => {
  const response = await fetch(RPC_HOST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "searchAssets",
      params: {
        ownerAddress,
        compressed: true,
        page: 1, // Starts at 1
        limit: 1000,
      },
    }),
  });
  const { result } = await response.json();
  console.log("Search Assets: ", result);
  return result;
};

// https://docs.helius.xyz/compression-and-das-api/digital-asset-standard-das-api/search-assets
export const searchAssetsByGrouping = async (
  ownerAddress: string,
  grouping: string[]
) => {
  const response = await fetch(RPC_HOST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "searchAssets",
      params: {
        // ownerAddress: '2k5AXX4guW9XwRQ1AKCpAuUqgWDpQpwFfpVFh3hnm2Ha',
        ownerAddress,
        compressed: true,
        grouping,
        // grouping: ["collection", "DRiP2Pn2K6fuMLKQmt5rZWyHiUZ6WK3GChEySUpHSS4x"],
        page: 1, // Starts at 1
        limit: 1000,
      },
    }),
  });
  const { result } = await response.json();
  console.log("Drip Haus Assets: ", result);
  return result;
};
