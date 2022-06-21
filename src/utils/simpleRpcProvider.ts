import { ethers } from "ethers";

const RPC_URL = "https://nodes.plexswap.com";

const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(RPC_URL, 56);

export default simpleRpcProvider;
