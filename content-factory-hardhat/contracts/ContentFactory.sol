// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ContentFactory
 * @dev Creates and manages content-based NFTs where multiple users can mint NFTs from the same content
 */
contract ContentFactory is ERC721, Ownable {
    uint256 private _tokenIds;
    
    struct Content {
        bytes32 contentHash;    // Hash of the content (computed off-chain)
        string contentURI;      // URI pointing to the content storage
        address submitter;      // Address of the content submitter
        uint256 totalMinted;    // Total number of NFTs minted for this content
        bool exists;            // Flag to check if content exists
    }

    // Mapping from content hash to Content struct
    mapping(bytes32 => Content) public contents;
    
    // Mapping from token ID to content hash
    mapping(uint256 => bytes32) public tokenContent;
    
    // Events
    event ContentSubmitted(bytes32 indexed contentHash, address indexed submitter, string contentURI);
    event NFTMinted(uint256 indexed tokenId, bytes32 indexed contentHash, address indexed minter);
    event StorageFeesCollected(bytes32 indexed contentHash, uint256 amount);
    event MintPriceUpdated(uint256 newPrice);

    // Fixed mint price set by DAO
    uint256 public mintPrice;
    address public daoTreasury;

    constructor() ERC721("ContentBookmark", "CBM") Ownable(msg.sender) {
        // Initialize both ERC721 and Ownable with msg.sender as the initial owner
    }

    /**
     * @dev Submits new content to the factory
     * @param contentHash Hash of the content (computed off-chain)
     * @param contentURI URI pointing to the content storage
     */
    function submitContent(
        bytes32 contentHash,
        string memory contentURI
    ) external {
        require(!contents[contentHash].exists, "Content already exists");
        
        contents[contentHash] = Content({
            contentHash: contentHash,
            contentURI: contentURI,
            submitter: msg.sender,
            totalMinted: 0,
            exists: true
        });

        emit ContentSubmitted(contentHash, msg.sender, contentURI);
    }

    /**
     * @dev Sets the mint price (only DAO)
     * @param newPrice New price for minting NFTs
     */
    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }

    /**
     * @dev Mints a new NFT for existing content
     * @param contentHash Hash of the content to mint NFT for
     */
    function mintContentNFT(bytes32 contentHash) external payable {
        Content storage content = contents[contentHash];
        require(content.exists, "Content does not exist");
        require(msg.value >= mintPrice, "Insufficient payment");

        // Increment token ID
        _tokenIds += 1;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        tokenContent[newTokenId] = contentHash;
        content.totalMinted++;

        // All fees go to DAO treasury for storage
        if (daoTreasury != address(0)) {
            payable(daoTreasury).transfer(msg.value);
        }

        emit NFTMinted(newTokenId, contentHash, msg.sender);
        emit StorageFeesCollected(contentHash, msg.value);
    }

    /**
     * @dev Returns the URI for a given token ID
     * @param tokenId The ID of the token
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // Check if the token exists by checking if it has a content hash
        require(tokenContent[tokenId] != bytes32(0), "Token does not exist");
        return contents[tokenContent[tokenId]].contentURI;
    }

    /**
     * @dev Returns content details
     * @param contentHash Hash of the content
     */
    function getContent(bytes32 contentHash) external view returns (
        string memory contentURI,
        address submitter,
        uint256 totalMinted
    ) {
        Content memory content = contents[contentHash];
        require(content.exists, "Content does not exist");
        
        return (
            content.contentURI,
            content.submitter,
            content.totalMinted
        );
    }

    /**
     * @dev Sets the DAO treasury address (only owner)
     * @param _treasury New treasury address
     */
    function setDaoTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury address");
        daoTreasury = _treasury;
    }
}
