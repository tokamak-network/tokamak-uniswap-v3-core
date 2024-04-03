import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import dotenv from 'dotenv'
import 'hardhat-typechain'
dotenv.config()

export default {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    thanossepolia: {
      url: `https://rpc.thanos-sepolia-test.tokamak.network`,
      accounts: [`${process.env.PRIVATE_KEY}`],
      chainId: 111551118080,
    },
    titansepolia:{
      url: `https://rpc.titan-sepolia.tokamak.network`,
      accounts: [`${process.env.PRIVATE_KEY}`],
      chainId: 55007
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    arbitrumRinkeby: {
      url: `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    arbitrum: {
      url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    optimismKovan: {
      url: `https://optimism-kovan.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    optimism: {
      url: `https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    polygon: {
      url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
    bnb: {
      url: `https://bsc-dataseed.binance.org/`,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
    customChains: [
      {
        network: 'thanossepolia',
        chainId: 111551118080,
        urls: {
          apiURL: 'https://explorer.thanos-sepolia-test.tokamak.network/api',
          browserURL: 'https://explorer.thanos-sepolia-test.tokamak.network/',
        },
      },
      {
        network: 'titansepolia',
        chainId: 55007,
        urls: {
          apiURL: 'https://explorer.titan-sepolia.tokamak.network/api',
          browserURL: 'https://explorer.titan-sepolia.tokamak.network/',
        }
      }
    ],
  },
  solidity: {
    version: '0.7.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 800,
      },
      metadata: {
        // do not include the metadata hash, since this is machine dependent
        // and we want all generated code to be deterministic
        // https://docs.soliditylang.org/en/v0.7.6/metadata.html
        bytecodeHash: 'none',
      },
    },
  },
}
