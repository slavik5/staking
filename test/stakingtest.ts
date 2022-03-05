import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther } from "ethers/lib/utils";

let addr: SignerWithAddress[];
let Token: ContractFactory;
let token: Contract;
let zeroAdd: string;
let Staking: ContractFactory;
let staking: Contract;

function skipTime(s: number) {
  ethers.provider.send("evm_increaseTime", [s]);
  ethers.provider.send("evm_mine", []);
}

describe("staking contract", function () {

  beforeEach(async () => {
    addr = await ethers.getSigners();

    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();

    Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(token.address);

    zeroAdd = '0x0000000000000000000000000000000000000000';
    token.grantRole(await token.DEFAULT_ADMIN_ROLE(), staking.address)

  });
  describe("claim", function () {
    // it("zero stake", async function () {      
    //   await expect ( staking.connect(addr[1]).claim()).to.be.revertedWith("zero stake"); 

    // });


    it("claim work right", async function () {
      await token.mint(addr[3].address, 1000);
      await token.connect(addr[3]).approve(staking.address, 1000);
      await staking.connect(addr[3]).stake(1000);
      await skipTime(600);
      await staking.connect(addr[3]).unstake();
      expect(await token.balanceOf(addr[3].address)).to.equal(1200);



    });
  });
  describe("Percent", function () {

    it("percent work right", async function () {

      await staking.connect(addr[0]).changePercent(1000);

      expect(await staking.percentOf()).to.be.equal(1000);

    });
  });
  describe("Time", function () {

    it("time work right", async function () {
      await staking.connect(addr[0]).changeTime(1000);

      expect(await staking.timeOf()).to.be.equal(1000);

    });
  });
  describe("stake", function () {

    it("stake work right", async function () {
      await token.connect(addr[0]).mint(addr[1].address, 10);
      await token.connect(addr[1]).approve(staking.address, 10);
      await staking.connect(addr[1]).stake(10);

      expect(await staking.stakingsOf(addr[1].address)).to.be.equal(10);

    });


  });
  describe("unstake", function () {

    it("unstake work right", async function () {
      await token.connect(addr[0]).mint(addr[1].address, 10);
      await token.connect(addr[1]).approve(staking.address, 10);
      await staking.connect(addr[1]).stake(10);
      await staking.connect(addr[1]).unstake();
      expect(await staking.stakingsOf(addr[1].address)).to.be.equal(0);

    });
  });

});