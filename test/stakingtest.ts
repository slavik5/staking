import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { parseEther } from "ethers/lib/utils";


let addr: SignerWithAddress[];
let owner: SignerWithAddress;
let token: ContractFactory;
let hardhattoken:Contract;
let zeroAdd:string;
let staker: SignerWithAddress;
let staking: ContractFactory;
let hardhatstaking:Contract;

function skipTime(s: number) {
    ethers.provider.send("evm_increaseTime", [s]);
    ethers.provider.send("evm_mine", []);
}

describe("staking contract", function () 
{

  beforeEach(async () => {
    addr = await ethers.getSigners();
    owner = addr[0];
    staker=addr[0];

    token = await ethers.getContractFactory("token");
    hardhattoken = await token.deploy();

    staking = await ethers.getContractFactory("staking");
    hardhatstaking = await staking.deploy(staker.address, hardhattoken.address);

    zeroAdd='0x0000000000000000000000000000000000000000';
    hardhattoken.grantRole(await hardhattoken.DEFAULT_ADMIN_ROLE(), hardhatstaking.address)
    hardhattoken.connect(staker).approve(hardhatstaking.address, parseEther("1000000"))
    
});
  describe("claim", function () {
    // it("zero stake", async function () {      
    //   await expect ( hardhatstaking.connect(addr[1]).claim()).to.be.revertedWith("zero stake"); 
    
    // });


    it("claim work right", async function () {  
        await hardhattoken.mint(addr[3].address, 1000);
        await hardhattoken.connect(addr[3]).approve(hardhatstaking.address, 1000);
        await hardhatstaking.connect(addr[3]).stake(1000);
        await skipTime(600);
        await hardhatstaking.connect(addr[3]).unstake();    
        expect (await hardhattoken.balanceOf(addr[3].address)).to.equal(1200);
        
      });
  });
  describe("Percent", function () {
    
    it("percent work right", async function () {  
      
      await hardhatstaking.connect(addr[0]).changePercent(1000);
          
      expect (await hardhatstaking.percentOf()).to.be.equal(1000); 
      
    });
  });
  describe("Time", function () {
    
    it("time work right", async function () {  
        await hardhatstaking.connect(addr[0]).changeTime(1000);
          
        expect (await hardhatstaking.timeOf()).to.be.equal(1000); 
      
    });
  });
  describe("stake", function () {
    
    it("stake work right", async function () {  
      await hardhattoken.connect(owner).mint(addr[1].address,10);
      await hardhattoken.connect(addr[1]).approve(hardhatstaking.address, 10);
      await hardhatstaking.connect(addr[1]).stake(10);
          
      expect (await hardhatstaking.stakingsOf(addr[1].address)).to.be.equal(10); 
      
    });

    
  });
  describe("unstake", function () {
    
    it("unstake work right", async function () {  
      await hardhattoken.connect(owner).mint(addr[1].address,10);
      await hardhattoken.connect(addr[1]).approve(hardhatstaking.address, 10);
      await hardhatstaking.connect(addr[1]).stake(10);
      await hardhatstaking.connect(addr[1]).unstake();    
      expect(await hardhatstaking.stakingsOf(addr[1].address)).to.be.equal(0); 
      
    });
  });
  
});