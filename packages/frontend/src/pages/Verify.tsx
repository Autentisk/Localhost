import { ethers, BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import contract from "./../config/SystemManager.json";
import contract2 from "./../config/DigitalCopy.json";
import { Button, Card, Form, Input, Space } from "antd";
import "./Homepage.css";

const abi = contract.abi;
const abi2 = contract2.abi;
const categories = ["Name:", "Price:", "Owner:", "Category", "Brand"];

type ItemInformation = (string | BigNumber)[];

const Verify: React.FC = () => {
  let signer;
  const [itemsInformation, setItemsInformation] = useState<ItemInformation[]>([]);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractAddress2 = "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883";
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  } else {
    console.log("Please install MetaMask!");
  }

  const contractInstance2 = new ethers.Contract(contractAddress2, abi2, signer);

  const handleFormSubmit = async (values: any) => {
    try {
      const { tokenId } = values;
      console.log(tokenId);
      if (window.ethereum) {
        const info = await contractInstance2.retrieveInformationForDigitalCopy(tokenId);
        console.log(info);
        setItemsInformation(info);
      } else {
        // User does not have MetaMask installed, handle it gracefully
        console.log("Please install MetaMask!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div>
        <h1>Verify owner</h1>
        <h2>Provide token ID and lookup owner</h2>
        <Form onFinish={handleFormSubmit}>
          <Form.Item name="tokenId" label="tokenId">
            <Input placeholder="Token ID" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form>
        <div>
          {itemsInformation.length > 0 ? (
            <div>
              <Space direction="vertical" size={20}>
                <div className="grid-container">
                  <Card size="small" title={itemsInformation[0].toString()} extra={<a href="#">More</a>}>
                    <p>
                      {" "}
                      <strong>Name</strong> {itemsInformation[0].toString()}
                    </p>
                    <p>
                      {" "}
                      <strong>Brand</strong> {itemsInformation[5].toString()}
                    </p>
                    <p>
                      {" "}
                      <strong>Serial number</strong> {itemsInformation[6].toString()}
                    </p>
                    <p>
                      {" "}
                      <strong>Owner</strong> {itemsInformation[2].toString()}
                    </p>
                  </Card>
                </div>
              </Space>
            </div>
          ) : (
            <p>No token provided</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Verify;
