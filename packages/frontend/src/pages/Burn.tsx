import { ethers, BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import contract from "./../config/SystemManager.json";
import contract2 from "./../config/DigitalCopy.json";
import { Card, Space } from "antd";
import { Button, Input } from "antd";
import "./Transfer.css";
import { log } from "console";

const abi = contract.abi;
const abi2 = contract2.abi;
const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const categories = ["Name:", "Price:", "Owner:", "Category", "Brand"];

type ItemInformation = (string | BigNumber)[];

const Burn: React.FC = () => {
  const [newAddresses, setNewAddresses] = useState<string[]>([]);
  const [newPrice, setNewPrice] = useState<string[]>([]);

  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [itemsInformation, setItemsInformation] = useState<ItemInformation[]>([]);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractAddress2 = "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883";
  let signer: ethers.providers.Provider | ethers.Signer | undefined;
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  } else {
    console.log("Please install MetaMask!");
  }
  const contractInstance = new ethers.Contract(contractAddress, abi, signer);
  const contractInstance2 = new ethers.Contract(contractAddress2, abi2, signer);

  const setItemforSale = async (index: number) => {
    try {
      if (window.ethereum) {
        await window.ethereum.enable(); // Request user permission to access accounts

        // Initialize ethers with MetaMask provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Initialize contract instance with signer
        const contractInstance3 = new ethers.Contract(contractAddress2, abi2, signer);
        const tokenID = ownedItems[index];
        await contractInstance3.burn(tokenID);

        console.log("Transaction successful!");
      } else {
        console.error("MetaMask not detected. Please install MetaMask to interact with the contract.");
      }
    } catch (error) {
      console.error("Error transferring item:", error);
    }
  };

  useEffect(() => {
    const fetchOwnedItems = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const account = window.ethereum.selectedAddress;
          console.log(account);
          const items = await contractInstance.retrieveAllOwnedItems(account);

          // Flatten the array and convert each BigNumber to a string
          const itemStrings = items.flat().map((item: ethers.BigNumber) => item.toString());

          // Update state
          setOwnedItems(itemStrings);

          const informations = await Promise.all(
            items.flat().map((item: BigNumber) => {
              const itemId = ethers.BigNumber.from(item).toNumber();
              return contractInstance2.retrieveInformationForDigitalCopy(itemId);
            }),
          );

          setItemsInformation(informations);
        } else {
          // User does not have MetaMask installed, handle it gracefully
          console.log("Please install MetaMask!");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchOwnedItems();
  }, []);

  return (
    <>
      <div>
        <h1>Owned Items</h1>
        <div>
          {itemsInformation.length > 0 ? (
            <div>
              <h2>Item Information</h2>
              <Space direction="vertical" size={20}>
                {itemsInformation.map((itemInformation, index) => (
                  <Card size="small" title={itemInformation[0].toString()} className="cardContainer">
                    {categories.map((category, index) => (
                      <p key={index}>
                        <strong>{category}</strong> {itemInformation[index].toString()}
                      </p>
                    ))}
                    <div className="buttonContaier">
                      <Button
                        type="primary"
                        onClick={() => setItemforSale(index)}
                        style={{ background: "red", borderColor: "red" }}
                      >
                        Delete item
                      </Button>
                    </div>
                  </Card>
                ))}
              </Space>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Burn;
