import {ethers} from "hardhat";


async function main() {
  
  const Token = await ethers.getContractFactory("Token");

  const token = await Token.deploy();
  await token.deployed();
  
  const Staking = await ethers.getContractFactory("Staking");

  const staking = await Staking.deploy(token.address);
  await staking.deployed();

  console.log("Token deployed to:", token.address);
  console.log("Staking deployed to:", staking.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
