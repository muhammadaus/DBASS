// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {ContentFactory} from "../src/ContentFactory.sol";

contract ContentFactoryTest is Test {
    ContentFactory public contentFactory;
    address public user = makeAddr("user");
    
    function setUp() public {
        contentFactory = new ContentFactory();
        contentFactory.setMintPrice(0.01 ether);
        contentFactory.setDaoTreasury(address(this));
    }
    
    function testSubmitContent() public {
        vm.prank(user);
        bytes32 contentHash = keccak256("test content");
        string memory contentURI = "ipfs://test";
        
        contentFactory.submitContent(contentHash, contentURI);
        
        (string memory uri, address submitter, uint256 minted) = contentFactory.getContent(contentHash);
        assertEq(uri, contentURI);
        assertEq(submitter, user);
        assertEq(minted, 0);
    }
    
    function testMintNFT() public {
        // Submit content first
        bytes32 contentHash = keccak256("test content");
        string memory contentURI = "ipfs://test";
        vm.prank(user);
        contentFactory.submitContent(contentHash, contentURI);
        
        // Mint NFT
        vm.deal(user, 1 ether);
        vm.prank(user);
        contentFactory.mintContentNFT{value: 0.01 ether}(contentHash);
        
        (, , uint256 minted) = contentFactory.getContent(contentHash);
        assertEq(minted, 1);
    }
} 