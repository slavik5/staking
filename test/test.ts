import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";


let addr: SignerWithAddress[];
let owner: SignerWithAddress;
let token: ContractFactory;
let hardhattoken:Contract;
let zeroAdd:string;
let staker: SignerWithAddress;
let staking: ContractFactory;
let hardhatstaking:Contract;



describe("token contract", function () 
{

  
  beforeEach(async () => {
    addr = await ethers.getSigners();
    owner = addr[0];
    token = await ethers.getContractFactory("token");

    hardhattoken = await token.deploy();
    zeroAdd='0x0000000000000000000000000000000000000000';
  });
  describe("name", function () {
    it("should return name", async function () {
      
      const Name=await hardhattoken.name();
      expect ("MyToken").to.equal(Name);
    });
  });
  describe("symbol", function () {
    it("should return symbol", async function () {
      
      const Symbol=await hardhattoken.symbol();
      expect ("MYT").to.equal(Symbol);
    });
  });
  describe("decimals", function () {
    it("should return decimals", async function () {
      
      const Decimals=await hardhattoken.decimals();
      expect (18).to.equal(Decimals);
    });
  });
  describe("totalSupply", function () {
    it("should return totalSupply", async function () {
      
      const bal=await hardhattoken.totalSupply();
      expect (await hardhattoken.balanceOf(owner.address)).to.equal(bal);
    });
  });
  describe("transfer", function () {
    it("should transfer on account balance", async function () {
      await hardhattoken.mint(addr[1].address, 10);
      await hardhattoken.connect(addr[1]).transfer(addr[2].address,10);
      expect (await hardhattoken.balanceOf(addr[2].address)).to.equal(10);
    });
    it("transfer on zero address", async function () {      
      await expect (hardhattoken.transfer(zeroAdd,10)).to.be.revertedWith("zero address"); 
    
    });
    it("not enough tokens on balance", async function () {      
      await expect (hardhattoken.connect(addr[2]).transfer(addr[1].address,10)).to.be.revertedWith("not enough tokens"); 
    
    });
  });
  describe("approve", function () {
    it("give allowance", async function () {
      await hardhattoken.mint(addr[1].address, 10);
      await hardhattoken.connect(addr[1]).approve(addr[2].address,10);
      expect (await hardhattoken.allowance(addr[1].address,addr[2].address)).to.equal(10);
    });
    it("spender- zero address", async function () {      
      await expect (hardhattoken.connect(addr[2]).approve(zeroAdd,10)).to.be.revertedWith("spender- zero address"); 
      
    });
  });
  describe("transferFrom", function () {
    it("should transfer between accounts", async function () {
      await hardhattoken.mint(addr[1].address,10);
      await hardhattoken.connect(addr[1]).approve(owner.address,10);
      await hardhattoken.transferFrom(addr[1].address,addr[2].address,10);
      expect (await hardhattoken.balanceOf(addr[2].address)).to.equal(10);
    });
    it("not enough tokens on balance", async function () {
        await hardhattoken.mint(addr[1].address,10);
        
        await expect( hardhattoken.transferFrom(addr[1].address,addr[2].address,15)).to.be.revertedWith("not enough tokens on balance"); 
    });
    it("not enough tokens on allowance", async function () {
        await hardhattoken.mint(addr[1].address, 10);
        
        await expect( hardhattoken.transferFrom(addr[1].address,addr[2].address,5)).to.be.revertedWith("not enough tokens on allowance");
    });
    it("from- zero address", async function () {      
      await expect (hardhattoken.transferFrom(zeroAdd,addr[1].address,10)).to.be.revertedWith("from- zero address"); 
    
    });
    it("to-zero address", async function () {      
      await expect (hardhattoken.transferFrom(addr[1].address,zeroAdd,10)).to.be.revertedWith("to-zero address"); 
    
    });
  });
  describe("increaseAllowance", function () {
    it("should transfer on account balance", async function () {
      
      await hardhattoken.approve(addr[2].address,10);
      await hardhattoken.increaseAllowance(addr[2].address,10);
      
      expect (await hardhattoken.allowance(owner.address,addr[2].address)).to.equal(20);
    
    });
    it("spender - zero address", async function () {      
      await expect (hardhattoken.increaseAllowance(zeroAdd,10)).to.be.revertedWith("spender - zero address"); 
      
    });
  });
  describe("mint", function () {
    it("msg.sender not owner", async function () {
      
      
      
      //await expect ( hardhattoken.connect(addr[2]).mint(addr[1].address, 10)).to.be.revertedWith("msg.sender not owner"); 
    
    });
    it("mint on zero address", async function () {      
      await expect (hardhattoken.mint(zeroAdd, 10)).to.be.revertedWith("account - zero address"); 
      
    });
  });
  describe("burn", function () {
    it("msg.sender not owner", async function () {
      
      await hardhattoken.mint(addr[1].address, 10);
      
      await expect ( hardhattoken.connect(addr[2]).burn(addr[1].address, 10)).to.be.revertedWith("msg.sender not owner"); 
    
    });
    it("burn on zero address", async function () {      
      await expect (hardhattoken.burn(zeroAdd, 10)).to.be.revertedWith("account - zero address"); 
      
    });
    it("not enough tokens on account", async function () {   
        
        await hardhattoken.mint(addr[1].address, 5);
        await expect (hardhattoken.burn(addr[1].address, 10)).to.be.revertedWith("not enough tokens on account"); 
        
    });
    it("burn works right", async function () {   
        
        await hardhattoken.mint(addr[1].address, 15);
        hardhattoken.burn(addr[1].address, 10)
        expect (await hardhattoken.balanceOf(addr[1].address)).to.be.equal(5); 
        
    });  
  });
  describe("decreaseAllowance", function () {
    it("should transfer on account balance", async function () {
    
      await hardhattoken.approve(addr[2].address,10);
      await hardhattoken.decreaseAllowance(addr[2].address,5);
      
      expect (await hardhattoken.allowance(owner.address,addr[2].address)).to.equal(5);
    
    });
    it("spender - zero address", async function () {      
      await expect (hardhattoken.decreaseAllowance(zeroAdd,10)).to.be.revertedWith("spender - zero address"); 
      
    });
    it("not enough for allowance", async function () {
    
      await hardhattoken.approve(addr[2].address,10);
      await expect (hardhattoken.decreaseAllowance(addr[2].address,15)).to.be.revertedWith("not enough for allowance"); 
    
    });
  });
  
});


