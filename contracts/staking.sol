// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Token.sol";
import "hardhat/console.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Staking is AccessControl {

    address tokenAddress;
    mapping(address => uint256) stakings;
    mapping(address => uint256) times;

    uint256 percent = 2000; // percent per time  
    uint256 time = 600;
    uint256 accuracy = 10000;

    constructor(address _token) {

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        tokenAddress = _token;
    }

    function changePercent(uint256 newPercent) public onlyRole(DEFAULT_ADMIN_ROLE) {
        percent = newPercent;
    }

    function percentOf() public view returns(uint256) {
        return percent;
    }

    function changeTime(uint256 newTime) public onlyRole(DEFAULT_ADMIN_ROLE) {
        time = newTime;
    }

    function timeOf() public view returns(uint256) {
        return time;
    }

    function claim() public {

        if(stakings[msg.sender] != 0){
            uint256 reward = (block.timestamp - times[msg.sender]) * stakings[msg.sender] * (percent) / accuracy / time;

            Token(tokenAddress).mint(msg.sender, reward);

            times[msg.sender] = block.timestamp;
        }

    }

    function stake(uint256 amount) public {
        claim();

        Token(tokenAddress).transferFrom(msg.sender, address(this), amount);

        times[msg.sender] = block.timestamp;
        stakings[msg.sender] += amount;

    }

    function unstake() public {
        claim();
        Token(tokenAddress).transfer(msg.sender, stakings[msg.sender]);

        stakings[msg.sender] = 0;

    }

    function stakingsOf(address account) public view returns(uint256) {
        return stakings[account];
    }

}