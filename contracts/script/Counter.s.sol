// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/POLTech.sol";

contract DeployPOLTech is Script {
    function run() external {
        vm.startBroadcast();

        address polVault = 0x0000000000000000000000000000000000000000;
        new POLTech(polVault);

        vm.stopBroadcast();
    }
}
