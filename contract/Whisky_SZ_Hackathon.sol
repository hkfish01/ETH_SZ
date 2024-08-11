// SPDX-License-Identifier: MIT
// Author BABAR R.
pragma solidity >=0.8.9 <0.9.0;

//import './ERC721A.sol';
import 'erc721a/contracts/ERC721A.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/common/ERC2981.sol';

contract Whisky is ERC721A, 
                   ReentrancyGuard, 
                   Ownable, 
                   ERC2981{

    using Strings for uint;
    
    // contract
    uint public cost = 0.0000002 ether;
    uint constant public maxSupply = 10000;
    uint public maxMintAmountPerTx = 2;
    string public contractURI = '';  // URL for the storefront-level metadata for contract
    bool public isSaleActive = false;   // is sale?

    string public uriPrefix = '';    // base uri
    string public uriOpenPrefix = ''; // open status uri 
    string public uriSuffix = '.json';   // base extension

    mapping (uint=>bool) public openStatus;
    struct OpenTokenLevel{
        uint randomNum;
        string level;
        uint openTokenId;
    }
    mapping (uint=>OpenTokenLevel) public tokenId2openTokenId;

    string[5] Levels = ['legendary','epic','rare','uncommon','common'];
    uint8[5] LevelPercentage = [2,8,15,25,50];
    uint16[5] LevelUsedCount = [0,0,0,0,0];

    // Transfer event emitted _from address _to address
    event TransferReceived(address _from, uint _amount);

    constructor(string memory _uriPrefix, string memory _uriOpenPrefix, string memory _contractUri) 
                ERC721A("Whisky", "WKY")
                Ownable(msg.sender){

        setUriPrefix(_uriPrefix);
        setUriOpenPrefix(_uriOpenPrefix);

        contractURI = _contractUri;
    }

    // ~~~~~~~~~~~~~~~~~~~~ Modifiers ~~~~~~~~~~~~~~~~~~~~
    modifier mintCompliance(uint256 _mintAmount) {
        require(isSaleActive, 'not started');
        require(_mintAmount > 0 && _mintAmount <= maxMintAmountPerTx, 'invalid mint amount!');
        require(_totalMinted() + _mintAmount <= maxSupply, 'max supply exceeded!');
        require(msg.value >= cost * _mintAmount, 'insufficient funds!');
        _;
    }

    // ~~~~~~~~~~~~~~~~~~~~ Public Functions ~~~~~~~~~~~~~~~~~~~~
    function mint(uint _mintAmount) public payable mintCompliance(_mintAmount) {
        uint startId = _nextTokenId();
        _safeMint(msg.sender, _mintAmount);
        uint endId = startId + _mintAmount;
        for(uint i = startId; i < endId; i++) {
            openStatus[i] = false;
        }
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId, true);
        return;
    }


    function open(uint _tokenId) public{
        require(_exists(_tokenId), 'nonexistent token');
        require(!openStatus[_tokenId], 'opened');
        require(msg.sender == getApproved(_tokenId) || msg.sender == ownerOf(_tokenId),'no permission');
        openStatus[_tokenId] = true;
        uint randomNumber = _getRandomNumber();
        _getOpenTokenId(_tokenId, randomNumber);
    }

    function _getRandomNumber() private view returns(uint){
        return uint(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender
        )))%100;
    }

    function _getOpenTokenId(uint _tokenId, uint _randomNum) private returns(OpenTokenLevel memory){
        uint nid =  _randomNum+1;
        if(nid <=2){
            tokenId2openTokenId[_tokenId] = _getLevelId(0);
        }else if(nid>2 && nid <=10){
            tokenId2openTokenId[_tokenId] = _getLevelId(1);
        }else if(nid>10 && nid <=25){
            tokenId2openTokenId[_tokenId] = _getLevelId(2);
        }else if(nid>25 && nid <=50){
            tokenId2openTokenId[_tokenId] = _getLevelId(3);
        }else{
            tokenId2openTokenId[_tokenId] = _getLevelId(4);
        }
        tokenId2openTokenId[_tokenId].randomNum=_randomNum;

        return tokenId2openTokenId[_tokenId];
    }

    function _getLevelId(uint levelsIndex)private returns(OpenTokenLevel memory){
        if(levelsIndex<0 || levelsIndex>=5) revert("exceeds data boundaries");
        OpenTokenLevel memory tokenlevel;

        // 
        if(LevelUsedCount[levelsIndex]< (LevelPercentage[levelsIndex]* maxSupply)/100 ){
            tokenlevel.level = Levels[levelsIndex];
            tokenlevel.openTokenId = LevelUsedCount[levelsIndex];
            LevelUsedCount[levelsIndex] += 1;
        }else{
            tokenlevel = _getLevelId(levelsIndex+1);
        }
        return tokenlevel;
    }

    // ~~~~~~~~~~~~~~~~~~~~ Various Checks ~~~~~~~~~~~~~~~~~~~~ 
    function tokenURI(uint _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), 'nonexistent token');

        if(!openStatus[_tokenId]){
            return bytes(uriPrefix).length > 0
                                ? string(abi.encodePacked(uriPrefix, _tokenId.toString(), uriSuffix))
                                : '';
        }else{
            string memory strLevel = tokenId2openTokenId[_tokenId].level;
            uint id = tokenId2openTokenId[_tokenId].openTokenId;
            if(bytes(strLevel).length == 0){
                return bytes(uriOpenPrefix).length > 0
                    ? string(abi.encodePacked(uriOpenPrefix, "temp", uriSuffix))
                    : '';
            }
            return bytes(uriOpenPrefix).length > 0
                    ? string(abi.encodePacked(uriOpenPrefix, strLevel,"/", id.toString(), uriSuffix))
                    : '';
        }
        
    }

    // ~~~~~~~~~~~~~~~~~~~~ onlyOwner Functions ~~~~~~~~~~~~~~~~~~~~
    function setContractURI(string memory _contractUri) public onlyOwner{
        contractURI = _contractUri;
    }

    function setSaleActive() public onlyOwner{
        isSaleActive = !isSaleActive;
    }

    function setCost(uint _cost) public onlyOwner {
        cost = _cost;
    }

    function setMaxMintAmountPerTx(uint _maxMintAmountPerTx) public onlyOwner {
        maxMintAmountPerTx = _maxMintAmountPerTx;
    }

    function setUriPrefix(string memory _uriPrefix) public onlyOwner {
        uriPrefix = _uriPrefix;
    }

    function setUriOpenPrefix(string memory _uriOpenPrefix) public onlyOwner {
        uriOpenPrefix = _uriOpenPrefix;
    }

    function setUriSuffix(string memory _uriSuffix) public onlyOwner {
        uriSuffix = _uriSuffix;
    }

    function emergencyWithdraw() public onlyOwner nonReentrant {
        (bool os, ) = payable(owner()).call{value: address(this).balance}('');
        require(os);
    }

    function totalMint() public view returns (uint256){
        return _totalMinted();
    }

    //This function is to overide supportInterface function of ERC721A and ERC2981
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721A, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    receive() payable external{
        // Transfer event
         emit TransferReceived(msg.sender, msg.value);
    }

}