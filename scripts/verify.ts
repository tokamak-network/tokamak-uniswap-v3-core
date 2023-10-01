import hre from 'hardhat'
import fs from 'fs'
const run = hre.run
const chainName = hre.network.name

let data = JSON.parse(fs.readFileSync(`deployed.uniswap.${chainName}.json`).toString())

const main = async () => {
  console.log('Verifying contracts...')
  const contractAddress = data['UniswapV3Factory']
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: [],
    })
  } catch (e) {
    if (e.meesage.toLowerCase().includes('already verified')) {
      console.log('Contract already verified')
    } else {
      console.log(e)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
