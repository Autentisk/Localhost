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


    // Setting up buyer
    const buyersReviews = await ReviewsFactory.attach(contractAddresses.reviews).connect(buyer);

    // Trying to make a review for wrong item
    try {
        console.log(signerAddress, digitalCopy.address);
        await buyersReviews.newReview(signerAddress, 4, digitalCopy.address, 1, 
            "0x74657374537472696e6720746f20636f6e7665727420746f2062797465733332", "Nice watch and good communication with seller!");
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'reason' in error) {
            const err = error as { reason: string };
            console.log('Revert reason:', err.reason);
        } else {
            console.error(error);
        }
    }

    // Making the review for the right item
    await buyersReviews.newReview(signerAddress, 4, digitalCopy.address, 0, 
        "0x74657374537472696e6720746f20636f6e7665727420746f2062797465736932", "Nice watch and good communication with seller!");
    
    // Verifying the review on the seller
    await digitalCopy.putItemForSale(1);
    console.log(await systemManager.retrieveListingInformation(digitalCopy.address, 1));

}


main(require("hardhat")).catch(e => {
console.error(e);
process.exit(1);
});