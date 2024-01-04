import loadash from 'lodash';
import RegistryNetworks from 'singularitynet-platform-contracts/networks/Registry.json' assert { type: 'json' } ;
// import RegistryAbi from "singularitynet-platform-contracts/abi/Registry.json";
import { createHelia as HeliaClient } from 'helia';
import { json as HeliaJSON } from '@helia/json';
import { FsBlockstore } from 'blockstore-fs';
import { join } from 'path';
import { CID } from 'multiformats/cid';
import logger from './utils/logger';

export default class IPFSMetadataProvider {
  // async HeliaClient() {
  //   const { createHelia } = await eval('import("helia")');
  //   return createHelia;
  // }
  // async HeliaJSON() {
  //   const { json } = await import("@helia/json");
  //   return json;
  // }
  constructor(web3, networkId, ipfsEndpoint) {
    this._web3 = web3;
    this._networkId = networkId;
    this._ipfsEndpoint = ipfsEndpoint;
    // this.init();
    this._helia = this._constructHeliaClient();
    this._heliaJson = HeliaJSON(this._helia);
    const registryAddress = RegistryNetworks[this._networkId].address;
    this._registryContract = new this._web3.eth.Contract(
      RegistryAbi,
      registryAddress,
    );
  }

  // async init() {
  //   this._helia = await this._constructHeliaClient(); //initialize Helia
  //   console.log("DEBUG : helia " + this._helia);
  //   this._heliaJson = await HeliaJSON(this._helia);
  //   console.log("DEBUG : heliaJson " + this._heliaJson);
  // }
  /**
   * @param {string} orgId
   * @param {string} serviceId
   * @returns {Promise.<serviceMetadata>}//Change from "ServiceMetadata" to "serviceMetaData"
   */
  async metadata(orgId, serviceId) {
    logger.debug(
      'Fetching service metadata [org: ${orgId} | service: ${serviceId}]',
    );

    // Convert to hex and pad with zeros to ensure 32 bytes
    let orgIdHex = this._web3.utils.asciiToHex(orgId);
    orgIdHex = orgIdHex.padEnd(66, '0'); // 66 = '0x' + 64 hex characters

    let serviceIdHex = this._web3.utils.asciiToHex(serviceId);
    serviceIdHex = serviceIdHex.padEnd(66, '0'); // 66 = '0x' + 64 hex characters

    const orgMetadata = await this._fetchOrgMetadata(orgIdHex);
    const serviceMetadata = await this._fetchServiceMetadata(
      orgIdHex,
      serviceIdHex,
    );

    return Promise.resolve(
      this._enhanceServiceGroupDetails(serviceMetadata, orgMetadata),
    );
  }

  async _fetchOrgMetadata(orgIdBytes) {
    logger.debug('Fetching org metadata URI from registry contract');
    const { orgMetadataURI } = await this._registryContract.methods
      .getOrganizationById(orgIdBytes)
      .call();

    return this._fetchMetadataFromIpfs(orgMetadataURI);
  }

  async _fetchServiceMetadata(orgIdBytes, serviceIdBytes) {
    logger.debug('Fetching service metadata URI from registry contract');
    const { metadataURI: serviceMetadataURI } = await this._registryContract.methods
      .getServiceRegistrationById(orgIdBytes, serviceIdBytes)
      .call();
    return this._fetchMetadataFromIpfs(serviceMetadataURI);
  }

  async _fetchMetadataFromIpfs(metadataURI) {
    const ipfsCID = `${this._web3.utils.hexToUtf8(metadataURI).substring(7)}`;
    logger.debug(`Fetching metadata from IPFS[CID: ${ipfsCID}]`);
    const json = await this._heliaJson();
    console.log(`Debug JSON${json}`);
    return await json.get(ipfsCID);
  }

  _enhanceServiceGroupDetails(serviceMetadata, orgMetadata) {
    const { groups: orgGroups } = orgMetadata;
    const { groups: serviceGroups } = serviceMetadata;

    const groups = loadash.map(serviceGroups, (group) => {
      const { group_name: serviceGroupName } = group;
      const orgGroup = loadash.find(
        orgGroups,
        ({ group_name: orgGroupName }) => orgGroupName === serviceGroupName,
      );
      return {
        ...group,
        payment: orgGroup.payment,
      };
    });

    return { ...serviceMetadata, groups };
  }

  async _constructHeliaClient() {
    console.log(`DEBUG: _constructHeliaClient: ${this._ipfsEndpoint}`);
    const url = new URL(this._ipfsEndpoint);
    const heliaConfig = {
      protocol: url.protocol.replace(':', ''),
      host: url.hostname,
      port: url.port || 5001,
    };
    console.log();
    const store = new FsBlockstore(join(url, '..', 'ipfs'));
    const createHelia = await HeliaClient({ blockstore: store });
    const helia = await createHelia(heliaConfig);
    console.log(`DEBUG: IPFSMetadataProveder.js helia${helia}`);
    return helia;
  }
}
