// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PoloController.sol";

abstract contract PoloFeed is PoloController {
    
 function Feed(uint Poloid) public OnlyOwnerPolo(Poloid) IsTime(Poloid){
      address _address = UsePoloAddress[Poloid];
     uint  UserPoloid = UsePoloId[Poloid];
     Polo storage mypolo = UserPolo[_address][UserPoloid-1];
      mypolo.feedCount++;
    _FeedTime(Poloid);
    if( mypolo.feedCount % 10 == 0){
        mypolo.level++;
        uint newDna = mypolo.dna - mypolo.dna % 10 + 8;
        string memory fathername = mypolo.name;
        string memory sonname =  "'s son";
        string memory newname = string(abi.encodePacked(fathername, sonname));
        _createPolo(newname, newDna,1);
        safeTransferFrom(owner,msg.sender,1,1,"");
    }
  }
}