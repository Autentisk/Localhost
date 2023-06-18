import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Contract, ContractFactory } from 'ethers';
const contractAddresses = require('./contractAddresses.json');


async function main(hre: HardhatRuntimeEnvironment) {

    // Setting up the environment
    const accounts = await hre.ethers.getSigners();
    const signerAddress = await accounts[0].getAddress();

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

    // Setting up the user
    try {
        await users.createUser("Kari Olsen", "01011991-04200")
    } catch (error) {
        
    }

    // Making purchases
    await trustedSeller.purchase("Cosmograph Daytona", "500 000", "Watch", "Rolex", "2049-3630", signerAddress);
    await trustedSeller.purchase("Submariner", "400 000", "Watch", "Rolex", "2050-3630", signerAddress);

    // Trusted Watches tries to sell the same item to Kari again
    try {
        await trustedSeller.purchase("Cosmograph Daytona", "500 000", "Watch", "Rolex", "2049-3630", signerAddress);
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'reason' in error) {
            const err = error as { reason: string };
            console.log('Revert reason:', err.reason);
        } else {
            console.error(error);
        }
    }

    // Showing proof of of ownership
    console.log( await digitalCopy.getOwner(0));
    console.log( await digitalCopy.retrieveInformationForDigitalCopy(0));
    console.log( await digitalCopy.getOwner(1));
    console.log( await digitalCopy.retrieveInformationForDigitalCopy(1));
    console.log( await systemManager.retrieveAllOwnedItems(signerAddress));

}


main(require("hardhat")).catch(e => {
console.error(e);
process.exit(1);
});