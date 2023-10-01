import 'hardhat-typechain'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import dotenv from 'dotenv'
dotenv.config()

export default {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    localhost: {
      forking: {
        url: `https://rpc.titan-goerli.tokamak.network`,
      },
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    titangoerli: {
      url: 'https://rpc.titan-goerli.tokamak.network',
      accounts: [`${process.env.PRIVATE_KEY}`],
      chainId: 5050,
      // gasPrice: 250000,
      deploy: ['deploy'],
    },
    titan: {
      url: 'https://rpc.titan.tokamak.network',
      accounts: [`${process.env.PRIVATE_KEY}`],
      chainId: 55004,
      // gasPrice: 250000,
      // deploy: ['deploy_titan'],
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
    // apiKey: `${process.env.ETHERSCAN_API_KEY}`
    apiKey: {
      goerli: `${process.env.ETHERSCAN_API_KEY}`,
      titangoerli: `${process.env.ETHERSCAN_API_KEY}`,
      titan: `${process.env.ETHERSCAN_API_KEY}`,
    },
    customChains: [
      {
        network: 'titangoerli',
        chainId: 5050,
        urls: {
          apiURL: 'https://explorer.titan-goerli.tokamak.network/api',
          browserURL: 'https://explorer.titan-goerli.tokamak.network',
        },
      },
      {
        network: 'titan',
        chainId: 55004,
        urls: {
          apiURL: 'https://explorer.titan.tokamak.network/api',
          browserURL: 'https://explorer.titan.tokamak.network',
        },
      },
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
