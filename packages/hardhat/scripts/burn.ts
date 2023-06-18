import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Contract, ContractFactory } from 'ethers';
const contractAddresses = require('./contractAddresses.json');

async function main(hre: HardhatRuntimeEnvironment) {

    // Setting up the environment
    const accounts = await hre.ethers.getSigners();
    const signerAddress = await accounts[0].getAddress();
    const buyer = accounts[1];

    let systemManager: Contract;    
    let trustedSeller: Contract;
    let digitalCopy: Contract;
    let users: Contract;
    let reviews: Contract;

    const SystemManagerFactory: ContractFactory = await hre.ethers.getContractFactory("SystemManager");
    const TrustedSellerFactory: ContractFactory = await hre.ethers.getContractFactory("TrustedSeller");
    const DigitalCopyFactory: ContractFactory = await hre.ethers.getContractFactory("DigitalCopy");
    const UsersFactory: ContractFactory = await hre.ethers.getContractFactory("Users");
    const ReviewsFactory: ContractFactory = await hre.ethers.getContractFactory("Reviews");

    systemManager = await SystemManagerFactory.attach(contractAddresses.systemManager);
    trustedSeller = await TrustedSellerFactory.attach(contractAddresses.trustedSeller);
    digitalCopy = await DigitalCopyFactory.attach(contractAddresses.digitalCopy);
    users = await UsersFactory.attach(contractAddresses.users);
    reviews = await ReviewsFactory.attach(contractAddresses.reviews);

    // Trying to burn the wrong NFT
    try {
        await digitalCopy.burn(0);
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'reason' in error) {
            const err = error as { reason: string };
            console.log('Revert reason:', err.reason);
        } else {
            console.error(error);
        }
    }

    // Burning the right NFT
    console.log( await systemManager.retrieveAllOwnedItems(signerAddress));
    await digitalCopy.burn(1);
    console.log( await systemManager.retrieveAllOwnedItems(signerAddress));
}


main(require("hardhat")).catch(e => {
console.error(e);
process.exit(1);
});