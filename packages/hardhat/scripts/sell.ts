import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Contract, ContractFactory } from 'ethers';
const contractAddresses = require('./contractAddresses.json');

async function main(hre: HardhatRuntimeEnvironment) {

    // Setting up the environment
    const accounts = await hre.ethers.getSigners();
    const sellerAddress = await accounts[0].getAddress();
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


    // Setting up buyer
    const buyersDigitalCopy = await DigitalCopyFactory.attach(contractAddresses.digitalCopy).connect(buyer);
    const buyersUsers = await UsersFactory.attach(contractAddresses.users).connect(buyer);
    try {
        await buyersUsers.createUser("Ola Hermansen", "12121992-60009")
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'reason' in error) {
            const err = error as { reason: string };
            console.log('Revert reason:', err.reason);
        } else {
            console.error(error);
        }
    }

    // Buyer tries to get information about an item not for sale
    console.log (await digitalCopy.getOwner(0));
    console.log( await buyersDigitalCopy.isItemForSale(0));
    try {
        console.log (await buyersDigitalCopy.retrieveInformationForDigitalCopy(0));
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'reason' in error) {
            const err = error as { reason: string };
            console.log('Revert reason:', err.reason);
        } else {
            console.error(error);
        }
    }
    
    // Seller puts the item for sale, now the buyer can access it
    await digitalCopy.putItemForSale(0);
    console.log (await buyersDigitalCopy.retrieveInformationForDigitalCopy(0));
    console.log( await buyersDigitalCopy.isItemForSale(0));

    // The seller makes the sale and transfers the NFT to the buyer
    await digitalCopy.transfer(0, buyer.address, "450 000");
    console.log (await digitalCopy.getOwner(0));

    // The seller tries to sell item back the themself cheaper
    await digitalCopy.putItemForSale(0);
    await digitalCopy.transfer(0, sellerAddress, "350 000");
}


main(require("hardhat")).catch(e => {
console.error(e);
process.exit(1);
});