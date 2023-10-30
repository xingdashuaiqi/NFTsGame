// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./ownable.sol";
import "./safemath.sol";
import "./ERC1155.sol";

abstract contract PoloFactory is Ownable,ERC1155 {
    using SafeMath for uint256;
    uint public PoloCount = 0; //魄罗数量
    uint public cooldownTime = 1 days;
    uint public PoloPrice = 0.01 ether;
    //定义魄罗结构体
    struct Polo {
        string name; //名字
        uint dna; //基因(唯一标识)
        uint id; //魄罗的编号
        uint16 winCount; //胜利次数
        uint16 lossCount; //失败次数
        uint16 feedCount; //投喂次数
        uint32 level; //等级
        uint256 feedTime; //喂食冷却时间
        uint256 readyTime; //攻击冷却时间
    }

    event NewPolo(uint poloId, string name, uint dna); //魄罗生成事件
    mapping(address => Polo[]) public UserPolo; //用户拥有的魄罗
    mapping(address => uint) public UserPoloCount; //用户魄罗id
    mapping(uint => address) public UsePoloAddress; //魄罗id与用户的绑定
    mapping(uint =>uint) public UsePoloId;//魄罗id绑定用户魄罗id  
    //生成魄罗   
    function CreatePolo(string memory _name) public {
        uint _dna = _generateRandomDna(_name);
        uint32 _level =uint32(_getprobability());
        _createPolo(_name, _dna,_level);
    }
    //生成概率事件
function _getprobability()private  returns (int32) {
  uint32 probability1 = 100;
  uint32 probability2 = 40;
  uint32 probability3 = 30;
  uint32 probability4 = 20;
  uint32 probability5 = 1;
  if (_getRandomNumber1()<=probability5){
    safeTransferFrom(owner,msg.sender,5,1,"");
     return 5;
  }else if(_getRandomNumber1()<=probability4){
    safeTransferFrom(owner,msg.sender,4,1,"");
     return 4;
  }else if(_getRandomNumber1()<=probability3){
    safeTransferFrom(owner,msg.sender,3,1,"");
     return 3;
  }else if(_getRandomNumber1()<=probability2){
    safeTransferFrom(owner,msg.sender,2,1,"");
     return 2;
  }else if(_getRandomNumber1()<=probability1){
    safeTransferFrom(owner,msg.sender,1,1,"");
     return 1;
  }
    return 0;
}
    //获取随机数
 function _getRandomNumber1() private view returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, address(msg.sender))));
        return randomNumber % 100; // 将随机数限制在0到99范围内
    }

    function _createPolo(string memory _name, uint _dna,uint32 _level) internal {
        PoloCount += 1;
        uint id = PoloCount;
        UsePoloAddress[id] = msg.sender;
        UserPolo[msg.sender].push(Polo(_name, _dna, id, 0, 0, 0, _level, 0, 0));
        UserPoloCount[msg.sender] = UserPoloCount[msg.sender].add(1);
        UsePoloId[id]= UserPoloCount[msg.sender];
        
        emit NewPolo(id, _name, _dna);
    }

    //通过名字生成16位的dna
    function _generateRandomDna(string memory _str) public pure returns (uint) {
        bytes32 hash = keccak256(abi.encodePacked(_str));
        uint randomUint256 = uint256(hash) % 10000000000000000;
        return randomUint256;
    }
    //购买魄罗
    function buyPolo(string memory _name) public payable{
    require(msg.value >= PoloPrice);
    uint randDna = _generateRandomDna(_name);
    uint32 _level =uint32(_getprobability());
    _createPolo(_name, randDna,_level);
  }
}
