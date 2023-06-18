import { ethers, BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import contract from "./../config/SystemManager.json";
import contract2 from "./../config/DigitalCopy.json";
import { Card, Space } from "antd";
import "./Homepage.css";

const abi = contract.abi;
const abi2 = contract2.abi;
const categories = ["Name:", "Price:", "Owner:", "Category", "Brand"];

type ItemInformation = (string | BigNumber)[];

const Homepage: React.FC = () => {
  let signer;
  const [ownedItems, setOwnedItems] = useState<BigNumber[]>([]);
  const [itemsInformation, setItemsInformation] = useState<ItemInformation[]>([]);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractAddress2 = "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883";
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  } else {
    console.log("Please install MetaMask!");
  }

  const contractInstance = new ethers.Contract(contractAddress, abi, signer);
  const contractInstance2 = new ethers.Contract(contractAddress2, abi2, signer);

  useEffect(() => {
    const fetchOwnedItems = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const account = window.ethereum.selectedAddress;
          console.log(account);

          const items = await contractInstance.retrieveAllOwnedItems(account);
          setOwnedItems(items);
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
                <div className="grid-container">
                  {itemsInformation.map((itemInformation, index) => (
                    <div className="grid-item" key={index}>
                      <Card size="small" title={itemInformation[0].toString()} extra={<a href="#">More</a>}>
                        {categories.map((category, index) => (
                          <p key={index}>
                            <strong>{category}</strong> {itemInformation[index].toString()}
                          </p>
                        ))}
                        <p>
                          <strong>For sale</strong> {itemInformation[11].toString()}
                        </p>
                      </Card>
                    </div>
                  ))}
                </div>
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

export default Homepage;
