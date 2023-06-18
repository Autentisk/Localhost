import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@typechain/ethers-v5'
import "hardhat-deploy";
import '@nomiclabs/hardhat-ethers';

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "localhost",
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    }
  }
};

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};

export default config;