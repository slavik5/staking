// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Token.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";

contract staking is AccessControl{
    address staker;
    uint256 totalReward;
    address tokenAddress;
    mapping(address => uint256) stakings;
    mapping(address => uint256) times;
    
    uint256 percent=2000;// percent per time  
    uint256 time=600; 
    uint256 accuracy=10000;
    constructor(address _staker, address _token){
        staker=_staker;
        _setupRole(DEFAULT_ADMIN_ROLE, _staker);
        tokenAddress = _token;
        
    } 
    function changePercent(uint256 newPercent) public onlyRole(DEFAULT_ADMIN_ROLE)
    {
        percent=newPercent;
    }
    function percentOf() public view returns(uint256)
    {
        return percent;
    }
    function changeTime(uint256 newTime) public onlyRole(DEFAULT_ADMIN_ROLE)
    {
        time=newTime;
    }
    function timeOf() public view returns(uint256)
    {
        return time;
    }
    function claim() public
    {
        //require(stakings[msg.sender]>0,"zero stake");
        
        uint256 reward=(block.timestamp-times[msg.sender]) * stakings[msg.sender] * (percent) / accuracy / time ;
        token(tokenAddress).mint(staker,reward);
        token(tokenAddress).transferFrom(staker,msg.sender,reward);
        times[msg.sender]=block.timestamp;

    }
    function stake(uint256 amount) public
    {
        claim();
        token(tokenAddress).transferFrom(msg.sender,staker,amount);
        times[msg.sender]=block.timestamp;
        stakings[msg.sender]+=amount;

    }
    
    function unstake() public
    {
        claim();
        token(tokenAddress).transferFrom(staker,msg.sender,stakings[msg.sender]);
        
        stakings[msg.sender]=0;

    }
    function stakingsOf(address account) public view returns(uint256)
    {
        return stakings[account];
    }

} 