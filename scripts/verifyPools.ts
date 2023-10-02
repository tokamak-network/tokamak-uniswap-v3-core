import hre from 'hardhat'
import fs from 'fs'
const run = hre.run
const chainName = hre.network.name

let data = JSON.parse(fs.readFileSync(`deployed.uniswap.${chainName}.poolAddress.json`).toString())

const main = async () => {
  console.log('Verifying contracts...')
  const addresses = Object.values(data)
  console.log(addresses)

  for (let i = 0; i < addresses.length; i++) {
    const contractAddress = addresses[i]
    try {
      await run('verify:verify', {
        address: contractAddress,
        constructorArguments: [],
      })
    } catch (e) {
      if (e.message.toLowerCase().includes('already verified')) {
        console.log('Contract already verified')
      } else {
        console.log(e)
      }
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
