import {ethers} from "hardhat";


async function main() {
  
  const token = await ethers.getContractFactory("token");

  const hardhattoken = await token.deploy();
  await hardhattoken.deployed();
  const staking = await ethers.getContractFactory("staking");

  const hardhatstaking = await staking.deploy();
  await hardhattoken.deployed();

  console.log("token deployed to:", hardhattoken.address);
  console.log("staking deployed to:", hardhatstaking.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
