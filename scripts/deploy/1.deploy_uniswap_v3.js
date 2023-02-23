const hre = require("hardhat");
const UniswapV3Factory = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json");

const WETH9 = require("../abis/WETH9.json");
// const UniswapV3Factory = require("../../artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json");
// const SwapRouter = require("../abis/SwapRouter.json");
// const NFTDescriptor = require("../abis/NFTDescriptor.json");
// const NonfungibleTokenPositionDescriptor = require("../abis/NonfungibleTokenPositionDescriptor.json");
// const NonfungiblePositionManager = require("../abis/NonfungiblePositionManager.json");
// const Quoter = require("../abis/Quoter.json");
// const QuoterV2 = require("../abis/QuoterV2.json");
// const TickLens = require("../abis/TickLens.json");
// const UniswapInterfaceMulticall = require("../abis/UniswapInterfaceMulticall.json");


const linkLibraries = require("./linkLibraries");
async function main() {

  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0];
  console.log(deployer.address);

  ///=========== WETH9
  const Weth9 = new hre.ethers.ContractFactory(WETH9.abi, WETH9.bytecode, deployer);
  const _weth9 = await Weth9.deploy();
  await _weth9.deployed();
  console.log(`WETH9 deployed to ${_weth9.address}`);

  let _weth9_code = await hre.ethers.provider.getCode(_weth9.address);
  if (_weth9_code === '0x')  console.log('WETH9 is null')

  ///=========== UniswapV3Factory
  const uniswapV3Factory = new hre.ethers.ContractFactory(UniswapV3Factory.abi, UniswapV3Factory.bytecode, deployer);

  // const uniswapV3Factory = await hre.ethers.getContractFactory("UniswapV3Factory");
  // const uniswapV3Factory = new hre.ethers.ContractFactory(UniswapV3Factory.abi, UniswapV3Factory.bytecode, deployer);
  const _uniswapV3Factory = await uniswapV3Factory.deploy();
  await _uniswapV3Factory.deployed();
  console.log(`UniswapV3Factory deployed to ${_uniswapV3Factory.address}`);

  let _uniswapV3Factory_code = await hre.ethers.provider.getCode(_uniswapV3Factory.address);
  if (_uniswapV3Factory_code === '0x')  console.log('uniswapV3Factory is null')

  /*
  ///=========== SwapRouter
  // const swapRouter = new hre.ethers.ContractFactory(SwapRouter.abi, SwapRouter.bytecode, deployer);

  const swapRouter = await hre.ethers.getContractFactory("SwapRouter");

  const _swapRouter = await swapRouter.deploy(_uniswapV3Factory.address, _weth9.address);
  await _swapRouter.deployed();
  console.log(`SwapRouter deployed to ${_swapRouter.address}`);


  let _swapRouter_code = await hre.ethers.provider.getCode(_swapRouter.address);
  if (_swapRouter_code === '0x')  console.log('_swapRouter is null')


  ///=========== NFTDescriptor
  const nFTDescriptor = new hre.ethers.ContractFactory(NFTDescriptor.abi, NFTDescriptor.bytecode, deployer);
  const _nFTDescriptor = await nFTDescriptor.deploy();
  await _nFTDescriptor.deployed();
  console.log(`NFTDescriptor deployed to ${_nFTDescriptor.address}`);

  let _nFTDescriptor_code = await hre.ethers.provider.getCode(_nFTDescriptor.address);
  if (_nFTDescriptor_code === '0x')  console.log('_nFTDescriptor is null')

  ///=========== NonfungibleTokenPositionDescriptor
  const linkedBytecode = linkLibraries(
    {
      bytecode: NonfungibleTokenPositionDescriptor.bytecode,
      linkReferences: NonfungibleTokenPositionDescriptor.linkReferences,
    },
    {
      NFTDescriptor: _nFTDescriptor.address,
    }
  );

  const nonfungibleTokenPositionDescriptor = new hre.ethers.ContractFactory(
    NonfungibleTokenPositionDescriptor.abi,
    linkedBytecode,
    deployer
    );
  const _nonfungibleTokenPositionDescriptor = await nonfungibleTokenPositionDescriptor.deploy(
    _weth9.address);
  await _nonfungibleTokenPositionDescriptor.deployed();
  console.log(`NonfungibleTokenPositionDescriptor deployed to ${_nonfungibleTokenPositionDescriptor.address}`);


  let _nonfungibleTokenPositionDescriptor_code = await hre.ethers.provider.getCode(_nonfungibleTokenPositionDescriptor.address);
  if (_nonfungibleTokenPositionDescriptor_code === '0x')  console.log('_nonfungibleTokenPositionDescriptor is null')

  ///=========== NonfungiblePositionManager
  const nonfungiblePositionManager = new hre.ethers.ContractFactory(NonfungiblePositionManager.abi,
    NonfungiblePositionManager.bytecode, deployer);
  const _nonfungiblePositionManager = await nonfungiblePositionManager.deploy(
    _uniswapV3Factory.address,
    _weth9.address,
    _nonfungibleTokenPositionDescriptor.address
    );
  await _nonfungiblePositionManager.deployed();
  console.log(`NonfungiblePositionManager deployed to ${_nonfungiblePositionManager.address}`);


  let _nonfungiblePositionManager_code = await hre.ethers.provider.getCode(_nonfungiblePositionManager.address);
  if (_nonfungiblePositionManager_code === '0x')  console.log('_nonfungiblePositionManager is null')

  //=============== Quoter
  const quoter = new hre.ethers.ContractFactory(Quoter.abi, Quoter.bytecode, deployer);
  const _quoter = await quoter.deploy(
    _uniswapV3Factory.address,
    _weth9.address
    );
  await _quoter.deployed();
  console.log(`Quoter deployed to ${_quoter.address}`);


  //=============== QuoterV2
  const quoterV2 = new hre.ethers.ContractFactory(QuoterV2.abi, QuoterV2.bytecode, deployer);
  const _quoterV2 = await quoterV2.deploy(
    _uniswapV3Factory.address,
    _weth9.address
    );
  await _quoterV2.deployed();
  console.log(`QuoterV2 deployed to ${_quoterV2.address}`);


  //=============== TickLens
  const tickLens = new hre.ethers.ContractFactory(TickLens.abi, TickLens.bytecode, deployer);
  const _tickLens = await tickLens.deploy();
  await _tickLens.deployed();
  console.log(`TickLens deployed to ${_tickLens.address}`);


  //=============== UniswapInterfaceMulticall
  const uniswapInterfaceMulticall = new hre.ethers.ContractFactory(UniswapInterfaceMulticall.abi, UniswapInterfaceMulticall.bytecode, deployer);
  const _uniswapInterfaceMulticall = await uniswapInterfaceMulticall.deploy();
  await _uniswapInterfaceMulticall.deployed();
  console.log(`UniswapInterfaceMulticall deployed to ${_uniswapInterfaceMulticall.address}`);
*/

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});