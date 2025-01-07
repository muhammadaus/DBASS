// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ContentFactory} from "../src/ContentFactory.sol";

contract DeployContentFactory is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deployer address:", deployer);
        
        vm.startBroadcast(deployerPrivateKey);
        
        ContentFactory contentFactory = new ContentFactory();
        
        // Set the treasury to the deployer address
        contentFactory.setDaoTreasury(deployer);
        
        vm.stopBroadcast();
        
        console.log("ContentFactory deployed to:", address(contentFactory));
        console.log("Treasury set to:", deployer);
    }
} 