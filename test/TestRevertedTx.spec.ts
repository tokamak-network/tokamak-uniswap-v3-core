import { ethers, waffle } from 'hardhat'
import { BigNumber, BigNumberish, constants, Wallet } from 'ethers'
import { TestERC20 } from '../typechain/TestERC20'
import { UniswapV3Factory } from '../typechain/UniswapV3Factory'
import { MockTimeUniswapV3Pool } from '../typechain/MockTimeUniswapV3Pool'
import { TestUniswapV3SwapPay } from '../typechain/TestUniswapV3SwapPay'
import checkObservationEquals from './shared/checkObservationEquals'
import { expect } from './shared/expect'

import { poolFixture, TEST_POOL_START_TIME } from './shared/fixtures'

import {
  expandTo18Decimals,
  FeeAmount,
  getPositionKey,
  getMaxTick,
  getMinTick,
  encodePriceSqrt,
  TICK_SPACINGS,
  createPoolFunctions,
  SwapFunction,
  MintFunction,
  getMaxLiquidityPerTick,
  FlashFunction,
  MaxUint128,
  MAX_SQRT_RATIO,
  MIN_SQRT_RATIO,
  SwapToPriceFunction,
} from './shared/utilities'
import { TestUniswapV3Callee } from '../typechain/TestUniswapV3Callee'
import { TestUniswapV3ReentrantCallee } from '../typechain/TestUniswapV3ReentrantCallee'
import { TickMathTest } from '../typechain/TickMathTest'
import { SwapMathTest } from '../typechain/SwapMathTest'

const createFixtureLoader = waffle.createFixtureLoader

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

describe('analyze reverted tx', () => {
  let wallet: Wallet, other: Wallet

  let token0: TestERC20
  let token1: TestERC20
  let token2: TestERC20

  let factory: UniswapV3Factory
  let pool: MockTimeUniswapV3Pool

  let swapTarget: TestUniswapV3Callee

  let swapToLowerPrice: SwapToPriceFunction
  let swapToHigherPrice: SwapToPriceFunction
  let swapExact0For1: SwapFunction
  let swap0ForExact1: SwapFunction
  let swapExact1For0: SwapFunction
  let swap1ForExact0: SwapFunction

  let feeAmount: number
  let tickSpacing: number

  let minTick: number
  let maxTick: number

  let mint: MintFunction
  let flash: FlashFunction

  let loadFixture: ReturnType<typeof createFixtureLoader>
  let createPool: ThenArg<ReturnType<typeof poolFixture>>['createPool']

  before('create fixture loader', async () => {
    ;[wallet, other] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other])
  })

  beforeEach('deploy fixture', async () => {
    ;({ token0, token1, token2, factory, createPool, swapTargetCallee: swapTarget } = await loadFixture(poolFixture))

    const oldCreatePool = createPool
    createPool = async (_feeAmount, _tickSpacing) => {
      const pool = await oldCreatePool(_feeAmount, _tickSpacing)
      ;({
        swapToLowerPrice,
        swapToHigherPrice,
        swapExact0For1,
        swap0ForExact1,
        swapExact1For0,
        swap1ForExact0,
        mint,
        flash,
      } = createPoolFunctions({
        token0,
        token1,
        swapTarget,
        pool,
      }))
      minTick = getMinTick(_tickSpacing)
      maxTick = getMaxTick(_tickSpacing)
      feeAmount = _feeAmount
      tickSpacing = _tickSpacing
      return pool
    }

    // default to the 30 bips pool
    pool = await createPool(FeeAmount.MEDIUM, TICK_SPACINGS[FeeAmount.MEDIUM])
  })

  // it('constructor initializes immutables', async () => {
  //   expect(await pool.factory()).to.eq(factory.address)
  //   expect(await pool.token0()).to.eq(token0.address)
  //   expect(await pool.token1()).to.eq(token1.address)
  //   expect(await pool.maxLiquidityPerTick()).to.eq(getMaxLiquidityPerTick(tickSpacing))
  // })
  // it('initliaze tick 3201', async () => {
  //   const tx = await pool.initialize(ethers.BigNumber.from('92979860367883423878727417014'))
  //   await tx.wait()
  //   expect((await pool.slot0()).tick).to.eq(ethers.BigNumber.from('3201'))
  //   expect((await pool.slot0()).sqrtPriceX96).to.eq(ethers.BigNumber.from('92979860367883423878727417014'))
  //   await expect(tx)
  //     .to.emit(pool, 'Initialize')
  //     .withArgs(ethers.BigNumber.from('92979860367883423878727417014'), ethers.BigNumber.from('3201'))
  // })
  // it('mint position', async () => {
  //   await pool.initialize(ethers.BigNumber.from('92979860367883423878727417014'))
  //   const tx = await mint(wallet.address, -960, 7800, ethers.BigNumber.from('83066419612309491814'))
  //   expect((await pool.slot0()).tick).to.eq(3201)
  //   expect(tx)
  //     .to.emit(pool, 'Mint')
  //     .withArgs(
  //       wallet.address,
  //       wallet.address,
  //       -960,
  //       7800,
  //       ethers.BigNumber.from('14539130071932514699'),
  //       ethers.BigNumber.from('18310725824838355733')
  //     )
  // })
  it('swap and collect', async () => {
    //pool initialize
    let tx
    await pool.initialize(ethers.BigNumber.from('92979860367883423878727417014'))

    //tx = await mint(wallet.address, -900, 7860, ethers.BigNumber.from('83066419612309491814'))
    // await tx.wait()
    // const token1BalanceBefore: bigint = (await token1.balanceOf(wallet.address)).toBigInt()
    // await swapExact0For1(ethers.BigNumber.from('5000000000000000000'), wallet.address)
    // const token1BalanceAfter: bigint = (await token1.balanceOf(wallet.address)).toBigInt()
    // await swapExact1For0(token1BalanceAfter - token1BalanceBefore, wallet.address)

    //mint
    console.log('============start============')
    tx = await mint(wallet.address, -960, 7800, ethers.BigNumber.from('83066419612309491814'))
    await tx.wait()
    //swap
    await swapExact0For1(ethers.BigNumber.from('5000000000000000000'), wallet.address)
    //await swapExact1For0(ethers.BigNumber.from('5000000000000000000'), wallet.address)
    //await pool.burn(-960, 7800, 0)
    //await pool.collect(wallet.address, -960, 7800, MaxUint128, MaxUint128)
    //await mint(wallet.address, -960, 7800, ethers.BigNumber.from('8460263344730792256'))
    //await mint(other.address, -960, 7800, ethers.BigNumber.from('8460263344730792256'))
    console.log('============burn============')
    await pool.burn(-960, 7800, ethers.BigNumber.from('83066419612309491814'))
    await pool.collect(wallet.address, -960, 7800, MaxUint128, MaxUint128)
    ////
    let positionKey = getPositionKey(wallet.address, -960, 7800)
    let position = await pool.positions(positionKey)
    let slot0 = await pool.slot0()
    //console.log(position)
    //console.log(slot0)
    //console.log('mint')
    console.log('============mint============')
    await mint(wallet.address, -960, 7800, ethers.BigNumber.from('6756420283922002303'))
    positionKey = getPositionKey(wallet.address, -960, 7800)
    position = await pool.positions(positionKey)
    slot0 = await pool.slot0()
    //console.log(position)
    //console.log(slot0)
  })
})
