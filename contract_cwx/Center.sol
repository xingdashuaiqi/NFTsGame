// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PoloFeed.sol";
import "./PoloController.sol";
import "./PoloShop.sol";
import "./ERC1155.sol";

 contract Center is PoloController,PoloFeed,PoloShop{
    uint256 public constant LEVEL1 = 1;
    uint256 public constant LEVEL2 = 2;
    uint256 public constant LEVEL3 = 3;
    uint256 public constant LEVEL4 = 4;
    uint256 public constant LEVEL5 = 5;
constructor()ERC1155("MyCryptoPolo","MCP"){
    _mint(msg.sender,LEVEL1,10*100,"");
    _mint(msg.sender,LEVEL2,10*40,"");
    _mint(msg.sender,LEVEL3,10*30,"");
    _mint(msg.sender,LEVEL4,10*20,"");
    _mint(msg.sender,LEVEL5,10*10,"");
    
}
   receive()external payable {
    }
//后续铸造
  function mint(address to,uint256 id,uint256 amount)external onlyOwner{
       _mint(to,id,amount,"");
      
  }
//拿到元数据
function _baseURI()internal pure override returns (string memory){
    return "ipfs://bafybeigmmpito2rcegwxxburbyebrsdrrg7ir2yumxapmjtyplugodeqze/";
}
    function withdraw() external onlyOwner {
        owner.transfer(address(this).balance);
    }

    function checkBalance() external view onlyOwner returns(uint) {
        return address(this).balance;
    }
    

}