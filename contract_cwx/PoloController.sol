// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PoloFactory.sol";

abstract contract PoloController is PoloFactory {
 uint public levelmoney = 0.1 ether;
 modifier OnlyOwnerPolo(uint  poloid){
    require(msg.sender == UsePoloAddress[poloid],"not owner!" );
    _;
 }
 modifier IsTime(uint  poloid){
       uint  UserPoloid = UsePoloId[poloid];
    require( UserPolo[msg.sender][UserPoloid - 1].readyTime<= block.timestamp,"no time!" );
    _;
 }
 //升级魄罗
 function Uplevelmoney(uint poloid)external payable OnlyOwnerPolo(poloid){
    require(msg.value >= levelmoney);
     uint  UserPoloid = UsePoloId[poloid];
    UserPolo[msg.sender][UserPoloid - 1].level++;
    safeTransferFrom(owner,msg.sender,2,1,"");
     safeTransferFrom(msg.sender,owner,1,1,"");
    
}
//查询用户魄罗
function GetPolo(address _owner)external view returns(Polo[] memory){
    
    return UserPolo[_owner];

}
//查询所有魄罗
function GetAllPolo()external view returns (Polo[] memory){
    Polo[] memory _allpolo = new Polo[](PoloCount);
    for(uint i=1;i<=PoloCount;i++){
      address _address =UsePoloAddress[i];
      uint _userpoloid = UsePoloId[i];
      _allpolo[i-1]=UserPolo[_address][_userpoloid-1];
    }
    return _allpolo;
    }
//查看单个魄罗
function GetPoloById(uint _Poloid)external view returns(Polo memory){
      address _address = UsePoloAddress[_Poloid];
          uint  UserPoloid = UsePoloId[_Poloid];
    return UserPolo[_address][UserPoloid-1];

}
//更改名字 
function changeName(uint _Poloid,string memory _name)external {
     UserPolo[msg.sender][_Poloid-1].name = _name;

}
//计算对战冷却
  function _AttactTime(uint poloid) internal {
      uint  UserPoloid = UsePoloId[poloid];
    UserPolo[msg.sender][UserPoloid - 1].readyTime  = block.timestamp + cooldownTime - (block.timestamp + cooldownTime) % 1 days;
  }
//计算喂食冷却时间
 function _FeedTime(uint poloid) internal {
      uint  UserPoloid = UsePoloId[poloid];
    UserPolo[msg.sender][UserPoloid -1].feedTime = block.timestamp + cooldownTime- (block.timestamp + cooldownTime) % 1 days;
  }
//获胜随机数
 function _getRandomNumber() private view returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, address(msg.sender))));
        return randomNumber % 100; // 将随机数限制在0到99范围内
    }
//规定胜率
function _getwinprobability( uint32 attack_level1,uint32 level2 )private pure returns (int32) {
  int32 attack_level11 = int32(attack_level1);
  int32 level22 =int32(level2);
  int32 getwinprobability = (attack_level11 - level22)*10 +50;
  return  getwinprobability;

}

//发起攻击
function Attack(uint attack_PoloId,uint _PoloId) external returns (uint){
       address Attackaccount = UsePoloAddress[attack_PoloId];
       address account2 = UsePoloAddress[_PoloId];
       uint UserPoloid1 = UsePoloId[attack_PoloId];
       uint UserPoloid2 = UsePoloId[_PoloId];
       uint32 attack_level1 = UserPolo[Attackaccount][UserPoloid1-1].level;
       uint32 level2 = UserPolo[account2][UserPoloid2-1].level;
       uint256 randomNumber = _getRandomNumber();
       uint256 getwinprobability = uint256(int256(_getwinprobability(attack_level1,level2)));
        if(randomNumber <= getwinprobability){
          UserPolo[Attackaccount][UserPoloid1-1].winCount++;
          UserPolo[account2][UserPoloid2-1].lossCount++;
          string memory fathername =  UserPolo[account2][UserPoloid2-1].name;
          string memory sonname =  "'s son";
          string memory newname = string(abi.encodePacked(fathername, sonname));
          uint newDna = _generateRandomDna(newname);
          _createPolo(newname, newDna,1);
          safeTransferFrom(owner,msg.sender,1,1,"");
          _AttactTime(attack_PoloId);
          return attack_PoloId;
         
        }
        else {
          UserPolo[Attackaccount][UserPoloid1-1].lossCount++;
          _AttactTime(attack_PoloId);
          return _PoloId;
        }
    }
}
