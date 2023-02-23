
const ethers = require("ethers")
const optimismSDK = require("@eth-optimism/sdk")
// const optimismSDK = require("@zena-park/tokamak-sdk")

const fs = require("fs")
require('dotenv').config()

const { FeeAmount, encodePriceSqrt, encodePath } = require("../utils");
const hre = require("hardhat");

// const optimismSDK = require("@eth-optimism/sdk")
// const optimismSDK = require("@zena-park/tokamak-sdk")

/*
WETH9 deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
UniswapV3Factory deployed to 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
SwapRouter deployed to 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
NFTDescriptor deployed to 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
NonfungibleTokenPositionDescriptor deployed to 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
NonfungiblePositionManager deployed to 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
Quoter deployed to 0x0165878A594ca255338adfa4d48449f69242Eb8F
QuoterV2 deployed to 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
TickLens deployed to 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6
UniswapInterfaceMulticall deployed to 0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
*/
const SwapRouterAddress ="0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
const NonfungiblePositionManagerAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
const UniswapV3FactoryAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const TON = "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2"
const TOS = "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"
const Fee = 3000

const IERC20Artifact = require("../abis/IERC20.json");
const WETH9 = require("../abis/WETH9.json");
const UniswapV3Factory = require("../abis/UniswapV3Factory.json");
const SwapRouterArtifact = require("../abis/SwapRouter.json");
const NFTDescriptor = require("../abis/NFTDescriptor.json");
const NonfungibleTokenPositionDescriptor = require("../abis/NonfungibleTokenPositionDescriptor.json");
const NonfungiblePositionManager = require("../abis/NonfungiblePositionManager.json");
const Quoter = require("../abis/Quoter.json");
const QuoterV2 = require("../abis/QuoterV2.json");
const TickLens = require("../abis/TickLens.json");
const UniswapInterfaceMulticall = require("../abis/UniswapInterfaceMulticall.json");
const UniswapV3PoolArtifact = require("../abis/UniswapV3Pool.json");


// Get an L2 signer
const getSigner = async () => {
  // let endpointUrl = `https://goerli.optimism.tokamak.network`
  let endpointUrl = `http://127.0.0.1:8545`

    const l2RpcProvider = optimismSDK.asL2Provider(
      new ethers.providers.JsonRpcProvider(endpointUrl)
    )
    //const wallet = hre.ethers.Wallet.fromMnemonic(process.env.MNEMONIC).connect(l2RpcProvider)

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, l2RpcProvider)

    return {
      wallet: wallet,
      providers: l2RpcProvider}
}   // getSigner


// Get estimates from the SDK
const getEstimates = async (provider, tx) => {
  return {
    totalCost: await provider.estimateTotalGasCost(tx),
    l1Cost: await provider.estimateL1GasCost(tx),
    l2Cost: await provider.estimateL2GasCost(tx),
    l1Gas: await provider.estimateL1Gas(tx)
  }
}    // getEstimates



async function main() {

  // const accounts = await hre.ethers.getSigners();
  // const deployer = accounts[0];
  const signer = await getSigner();
  deployer = signer.wallet;
  providers = signer.providers;


  console.log("deployer", deployer.address);

  let UniswapV3FactoryAddressCode1 = await providers.getCode(UniswapV3FactoryAddress);
  if (UniswapV3FactoryAddressCode1 === '0x')  console.log('UniswapV3Factory is null')

  ///=========== UniswapV3Factory
  // const UniswapV3FactoryContract = await hre.ethers.getContractAt(UniswapV3Factory.abi, UniswapV3FactoryAddress,  deployer)

  const UniswapV3Factory_ = new ethers.ContractFactory(
      UniswapV3Factory.abi, UniswapV3Factory.bytecode, deployer)
  const UniswapV3FactoryContract = UniswapV3Factory_.attach(UniswapV3FactoryAddress)

  const poolAddress = await UniswapV3FactoryContract.getPool(TON, TOS, Fee);
  console.log("poolAddress", poolAddress);
  let poolCode1 = await providers.getCode(poolAddress);
  if (poolCode1 === '0x')  console.log('poolAddress is null')

  let allowanceAmount =  ethers.utils.parseEther("10000000000000")

  ///=========== TONContract
  const TONContract_ = new ethers.ContractFactory(IERC20Artifact.abi, IERC20Artifact.bytecode, deployer)
  const TONContract = TONContract_.attach(TON)


  let balanceBeforeTON = await TONContract.balanceOf(deployer.address);
  console.log("balanceBeforeTON", balanceBeforeTON.toString());

  let allowance = await TONContract.allowance(deployer.address, NonfungiblePositionManagerAddress);
  console.log("allowance 1 TON ", allowance.toString());
  console.log("allowanceAmount ", allowanceAmount);

  if(allowance.lt(allowanceAmount)){
    const tx = await TONContract.approve(
      NonfungiblePositionManagerAddress,
      allowanceAmount
      );
    console.log("tx", tx);
    await tx.wait();

    console.log("deployer.address ", deployer.address);
    console.log("NonfungiblePositionManagerAddress ", NonfungiblePositionManagerAddress);

    // allowance = await TONContract.allowance(deployer.address, NonfungiblePositionManagerAddress);
    // console.log("allowance 2 TON ", allowance);
  }
  ///=========== TOSContract
  const TOSContract_ = new ethers.ContractFactory(IERC20Artifact.abi, IERC20Artifact.bytecode, deployer)
  const TOSContract = TOSContract_.attach(TOS)

  let balanceBeforeTOS = await TOSContract.balanceOf(deployer.address);
  console.log("balanceBeforeTOS", balanceBeforeTOS.toString());

  allowance = await TOSContract.allowance(deployer.address, NonfungiblePositionManagerAddress);
  console.log("allowance 1 TOS ", allowance );

  if(allowance.lt(allowanceAmount)){
    const tx = await TOSContract.approve(
      NonfungiblePositionManagerAddress,
      allowanceAmount
      );
    console.log("tx", tx);
    await tx.wait();

    console.log("NonfungiblePositionManagerAddress ", NonfungiblePositionManagerAddress);

    // let allowance2 = await TOSContract.allowance(deployer.address, NonfungiblePositionManagerAddress);
    // console.log("allowance 2 TOS", allowance2.toString());
  }

  ///=========== NonfungiblePositionManager
    const NonfungiblePositionManagerContract_ = new ethers.ContractFactory(
      NonfungiblePositionManager.abi, NonfungiblePositionManager.bytecode, deployer)
    const NonfungiblePositionManagerContract = NonfungiblePositionManagerContract_.attach(
      NonfungiblePositionManagerAddress)

    let initParams = [
      TON,
      TOS,
      Fee,
      encodePriceSqrt(1, 1),
    ];
    if (TOS < TON) {
      initParams = [
        TOS,
        TON,
        Fee,
        encodePriceSqrt(1, 1),
      ];
    }

    console.log({ initParams });

    // const tx = await NonfungiblePositionManagerContract
    //   .createAndInitializePoolIfNecessary(...initParams, {
    //     gasLimit: 2000000
    //   });

    const tx = await NonfungiblePositionManagerContract
      .createAndInitializePoolIfNecessary(...initParams, {
        gasLimit: 3000000
      });
    console.log("tx",tx);

    await tx.wait();
      /*
  let poolCode2 = await providers.getCode(poolAddress);
  if (poolCode2 === '0x')  console.log('poolAddress is null')

 ///=========== UniswapV3PoolArtifact
  const UniswapV3Pool_ = new ethers.ContractFactory(
    UniswapV3PoolArtifact.abi, UniswapV3PoolArtifact.bytecode, deployer)
  const UniswapV3Pool = UniswapV3Pool_.attach(poolAddress)

  const slot0 = await UniswapV3Pool.slot0();
  console.log("slot0", slot0);

  ///=========== SwapRouter
  const SwapRouter_ = new ethers.ContractFactory(
    SwapRouterArtifact.abi, SwapRouterArtifact.bytecode, deployer)
  const SwapRouter = SwapRouter_.attach(SwapRouterAddress)

  let swapCode  = await providers.getCode(SwapRouterAddress);
  if (swapCode === '0x')  console.log('SwapRouter is null')


  const amountIn = ethers.utils.parseEther("1");
  let deadline = Date.now() + 100000;
  const path = encodePath([TON, TOS], [3000]);
  const amountOutMinimum = 10;
  const params = {
    recipient: deployer.address,
    path,
    amountIn,
    amountOutMinimum,
    deadline,
  };
  console.log("params", params);

  let real = {}
  const fakeTxReq = await SwapRouter.populateTransaction.exactInput(params)
  console.log("fakeTxReq", fakeTxReq)

  try {
    console.log("About to create the transaction")
    realTx = await SwapRouter.exactInput(params)
    realTx.gasPrice = realTx.maxFeePerGas;
    console.log("Transaction created and submitted")
    realTxResp = await realTx.wait()
    console.log("Transaction processed")
  } catch (err) {
    console.log(`Error: ${err}`)
    console.log(`Coming from address: ${await deployer.getAddress()}  `)
    process.exit(-1)
  }
  */
  // const fakeTx = await deployer.populateTransaction(fakeTxReq)
  // console.log("fakeTx", fakeTx)

  // console.log("About to get estimates")
    // let estimated = await deployer.provider.estimateL2GasCost(fakeTx)
    // estimated.l2Gas = await SwapRouter.estimateGas.exactInput(params)
  // const tx1 = await SwapRouter.exactInput(params);
/*
  let realTx, realTxResp
  const weiB4 = await deployer.getBalance()

  try {
    console.log("About to create the transaction")
    realTx = await SwapRouter.exactInput(params)
    realTx.gasPrice = realTx.maxFeePerGas;
    console.log("Transaction created and submitted")
    realTxResp = await realTx.wait()
    console.log("Transaction processed")
  } catch (err) {
    console.log(`Error: ${err}`)
    console.log(`Coming from address: ${await deployer.getAddress()}  `)
    process.exit(-1)
  }

  // Get the real information (cost, etc.) from the transaction response
  real.l1Gas = realTxResp.l1GasUsed
  real.l2Gas = realTxResp.gasUsed
  real.l1Cost = realTxResp.l1Fee
  real.l2Cost = real.totalCost - real.l1Cost

  console.log(real);
  */
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});