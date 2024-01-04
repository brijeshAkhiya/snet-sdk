// import { createHelia as HeliaClient } from "helia";
// import { json as HeliaJSON } from "@helia/json";
// import jsonc from "jsonc";
// import { FsBlockstore } from 'blockstore-fs';
// import { join } from "path";
// import { CID } from 'multiformats/cid';
// import Web3, { utils } from "web3";
// // var _Registry = _interopRequireDefault(require("singularitynet-platform-contracts/networks/Registry.json"));
// // var _Registry2 = _interopRequireDefault(require("singularitynet-platform-contracts/abi/Registry.json"));
// // import _Registry from "singularitynet-platform-contracts/networks/Registry.json";
// import abi  from "./utils/abi.json" with { type: "json" };
// // function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// // const registryAddress = _Registry.default[5].address;
// const registryAddress = "0x0DD7feC305f2374d7eed35d6d28134936c025A7A";
// const web3Provider = "https://goerli.infura.io/v3/b3b8f1b88e014b94984dba09b01ea20d";

// const _web3 = new Web3(web3Provider, null);
// const registryContract = new _web3.eth.Contract(abi, registryAddress);

// const url = "http://ipfs.singularitynet.io:80";
// const store = new FsBlockstore(join(url, '..', 'ipfs'));
// // const heliaConfig = {
// //     protocol: url.protocol.replace(":", ""),
// //     host: url.hostname,
// //     port: url.port || 5001,
// // };
// const helia = await HeliaClient({ blockstore: store });
// export const json = HeliaJSON(helia);


// const orgId = "snet";
// let orgIdBytes = _web3.utils.asciiToHex(orgId);
// orgIdBytes = orgIdBytes.padEnd(66, "0");
// const {
//     orgMetadataURI
//   } = await registryContract.methods.getOrganizationById(orgIdBytes).call();
// const ipfsCID = `${utils.hexToUtf8(orgMetadataURI).substring(7)}`;
// const cid = CID.parse(ipfsCID.toString());

// console.log(cid);