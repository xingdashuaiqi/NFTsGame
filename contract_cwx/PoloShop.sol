// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./PoloController.sol";
import "./erc721.sol";
abstract contract PoloShop is PoloController, ERC721 {
  using SafeMath for uint256;
    //市场结构体
    struct PoloMarket{
        uint poloid;
        address  payable seller;
        uint price;
    }
  uint public shopCount;//市场编号
  uint public minPrice = 1 ether; //设置最低售价
  mapping(uint=>PoloMarket) public PoloShops;//通过魄罗id指向市场
  mapping (uint => address) PoloApprovals;

  function balanceOf(address _owner) public view override returns (uint _balance) {
    return UserPoloCount[_owner];
  }

  function ownerOf(uint256 _tokenId) public view override returns (address _owner) {
    return UsePoloAddress[_tokenId];
  }

  function _transfer(address _from, address _to, uint256 _tokenId) public {
    UserPoloCount[_to] = UserPoloCount[_to].add(1);
    UsePoloAddress[_tokenId] = _to;
    uint id = UsePoloId[_tokenId];
    UserPolo[_to].push(UserPolo[_from][id-1]);
    UsePoloId[_tokenId]= UserPoloCount[_to];
    delete UserPolo[_from][id-1];
    emit Transfer(_from, _to, _tokenId);
  }

  function transfer(address _to, uint256 _tokenId) public override   {
    _transfer(msg.sender, _to, _tokenId);
  }

  function approve(address _to, uint256 _tokenId) public override  OnlyOwnerPolo(_tokenId) {
    PoloApprovals[_tokenId] = _to;
    emit Approval(msg.sender, _to, _tokenId);
  }

  function takeOwnership(uint256 _tokenId) public override  {
    require(PoloApprovals[_tokenId] == msg.sender);
    address owner = ownerOf(_tokenId);
    _transfer(owner, msg.sender, _tokenId);
  }
  //出售魄罗
   function salePolo(uint _PoloId,uint _price)public OnlyOwnerPolo(_PoloId){
        require(_price >= minPrice ,'Your price must > minPrice');
        PoloShops[_PoloId] = PoloMarket(_PoloId,payable(msg.sender),_price);
        shopCount = shopCount.add(1);
        
    }
    //购买魄罗
     function buyShopPolo(uint _PoloId)public payable{
        // require(msg.value >= PoloShops[_PoloId].price,'No enough money');
        _transfer(PoloShops[_PoloId].seller,msg.sender, _PoloId);
        PoloShops[_PoloId].seller.transfer(msg.value -msg.value*10 / 100);
        uint  UserPoloid = UsePoloId[_PoloId];
        uint32 level = UserPolo[PoloShops[_PoloId].seller][UserPoloid-1].level;
        safeTransferFrom(PoloShops[_PoloId].seller,msg.sender,level,1,"");
        delete PoloShops[_PoloId];
        shopCount = shopCount.sub(1);
    }
     function getShopPolo() external view returns(PoloMarket[] memory) { 
       PoloMarket[] memory allMarkets = new PoloMarket[](shopCount);
       uint index = 0;
        for (uint i = 1; i <= PoloCount; i++) {
            if(PoloShops[i].poloid != 0){
            allMarkets[index] = PoloShops[i];
            index++;
            }
        }
        return allMarkets;
    }
    
}
