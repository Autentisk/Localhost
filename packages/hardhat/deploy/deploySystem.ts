import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Contract, ContractFactory } from 'ethers';
import * as fs from 'fs';

async function main(hre: HardhatRuntimeEnvironment) {
    let systemManager: Contract;
    let trustedSeller: Contract;
    let digitalCopy: Contract;

    // Deploy SystemManager with Users and Reviews
    const SystemManagerFactory: ContractFactory = await hre.ethers.getContractFactory("SystemManager");
    let usersAddress: string | null = null;
    let reviewsAddress: string | null = null;
    systemManager = await SystemManagerFactory.deploy();
    
    let UsersEvent: Promise <void> = new Promise((resolve, reject) => {
        systemManager.once("DeployedUsersContract", (address) => {
            usersAddress = address;
            console.log("Users.sol contract deployed to address:", address)
            resolve();
        });

    });

    let ReviewsEvent: Promise <void> = new Promise((resolve, reject) => {
        systemManager.once("DeployedReviewsContract", (address) => {
            reviewsAddress = address;
            console.log("Reviews.sol contract deployed to address:", address);
            resolve();
        });
    });

    await UsersEvent;
    await ReviewsEvent;
    await systemManager.deployed();

    console.log("SystemManager.sol contract deployed to address: ", systemManager.address);

  // Deploy DigitalCopy.sol
    const DigitalCopyFactory: ContractFactory = await hre.ethers.getContractFactory("DigitalCopy");
    
    let digitalCopyAddress: string | null = "";
    await systemManager.deployDigitalCopy();

    let DigialCopyEvent: Promise <void> = new Promise((resolve, reject) => {
        systemManager.on("DeployedDigitalCopyContract", (address) => {
            digitalCopyAddress = address;
            console.log("DigitalCopy.sol contract deployed to address:", address);
            resolve();
        });
    });
    
    await DigialCopyEvent;

    digitalCopy = DigitalCopyFactory.attach(digitalCopyAddress);

    // Deploy TrustedSeller.sol
    const TrustedSellerFactory: ContractFactory = await hre.ethers.getContractFactory("TrustedSeller");
    trustedSeller = await TrustedSellerFactory.deploy("TrustedWatches", systemManager.address);
    await trustedSeller.deployed();
    console.log("TrustedSeller.sol contract deployed to address: ", trustedSeller.address);


    // Add Trusted Seller to the approved list
    await systemManager.add(trustedSeller.address);

    // Set Trusted Sellers' DigitalCopy contract to interact with
    await trustedSeller.changeDigitalCopyContract(digitalCopyAddress);

    // Write variables to file
    let contractAddresses = {
        systemManager: systemManager.address,
        trustedSeller: trustedSeller.address,
        digitalCopy: digitalCopyAddress,
        users: usersAddress,
        reviews: reviewsAddress
    };

    fs.writeFileSync('scripts/contractAddresses.json', JSON.stringify(contractAddresses, null, 2));

    process.exit(0);
    }


main(require("hardhat")).catch(e => {
console.error(e);
process.exit(1);
});