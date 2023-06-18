import React from "react";
import { Button, Form, Input } from "antd";
import contract from "./../config/TrustedSeller.json";
import { ethers } from "ethers";

const abi = contract.abi;
const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const contractInstance = new ethers.Contract(contractAddress, abi, provider);
const buyer = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

const SellItem = () => {
  const handleFormSubmit = async (values: any) => {
    try {
      const { name, price, category, brand, serialnumber, buyerAddress } = values;

      // Check if MetaMask is installed
      if (window.ethereum) {
        await window.ethereum.enable(); // Request user permission to access accounts

        // Initialize ethers with MetaMask provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Initialize contract instance with signer
        const contractInstance = new ethers.Contract(contractAddress, abi, signer);

        // Call the purchase function
        await contractInstance.purchase(name, price, category, brand, serialnumber, buyerAddress);

        console.log("Transaction successful!");
      } else {
        console.error("MetaMask not detected. Please install MetaMask to interact with the contract.");
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <Form onFinish={handleFormSubmit}>
      <Form.Item name="name" label="Name">
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item name="price" label="Price">
        <Input placeholder="Price" />
      </Form.Item>

      <Form.Item name="category" label="Category">
        <Input placeholder="Category" />
      </Form.Item>

      <Form.Item name="brand" label="Brand">
        <Input placeholder="Brand" />
      </Form.Item>

      <Form.Item name="serialnumber" label="Serial Number">
        <Input placeholder="Serial Number" />
      </Form.Item>

      <Form.Item name="buyerAddress" label="Buyer Address">
        <Input placeholder="Buyer Address" />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Mint new NFT
      </Button>
    </Form>
  );
};

export default SellItem;
