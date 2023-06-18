//Fill inn review
import { ethers, BigNumber } from "ethers";
import React, { useEffect, useState } from "react";
import contract from "./../config/SystemManager.json";
import contract2 from "./../config/DigitalCopy.json";
import { Card, Form, InputNumber, Space } from "antd";
import { Button, Input } from "antd";
import "./Transfer.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import contract3 from "./../config/Reviews.json";
import { log } from "console";

const abi = contract.abi;
const abi2 = contract2.abi;
const abi3 = contract3.abi;
const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

type ItemInformation = (string | BigNumber)[];

const ReviewItem: React.FC = () => {
  const { itemId } = useParams<{ itemId: string | undefined }>();

  const [ownedItems, setOwnedItems] = useState<string[]>([]);
  const [itemsInformation, setItemsInformation] = useState<ItemInformation[]>([]);
  const contractAddress2 = "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883";
  const contractAddress3 = "0xb7a5bd0345ef1cc5e66bf61bdec17d2461fbd968";
  let signer: ethers.providers.Provider | ethers.Signer | undefined;
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  } else {
    console.log("Please install MetaMask!");
  }
  const contractInstance2 = new ethers.Contract(contractAddress2, abi2, signer);
  const contractInstance3 = new ethers.Contract(contractAddress3, abi3, signer);

  useEffect(() => {
    const fetchOwnedItems = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const account = window.ethereum.selectedAddress;

          const informations = await contractInstance2.retrieveInformationForDigitalCopy(itemId);

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

  const sendReview = async (values: any) => {
    const { rating, comment } = values;
    console.log(rating);
    console.log(comment);

    const addressSeller = itemsInformation[9][0];
    console.log(addressSeller.toString());

    const transactionID = ethers.utils.formatBytes32String("123456");

    // newReview(address _seller, uint8 rating, address _digitalCopy, uint256 _digitalCopyID, bytes32 _transactionID, string memory _text)
    contractInstance3.newReview(addressSeller.toString(), 2, contractAddress2, itemId, transactionID, comment);
  };

  return (
    <>
      <div>
        <h1>Make a review</h1>
        <div>
          {itemsInformation.length > 0 ? (
            <div>
              <h2>Please fill in to provide feedback</h2>

              <Card size="small" className="cardContainer">
                <p>
                  <strong>Brand</strong> {itemsInformation[4].toString()}
                </p>
                <p>
                  <strong>Name</strong> {itemsInformation[0].toString()}
                </p>
                <p>
                  <strong>Price</strong> {itemsInformation[1].toString()}
                </p>
                <p>
                  <strong>Prev owner</strong> {itemsInformation[9].toString()}
                </p>

                <Form onFinish={sendReview}>
                  <Form.Item name="rating" label="Rating (1-6)">
                    <InputNumber min={1} max={6} defaultValue={3} />
                  </Form.Item>

                  <Form.Item name="comment" label="Comment">
                    <Input placeholder="Comment" />
                  </Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit a seller review
                  </Button>
                </Form>
              </Card>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewItem;

//address _digitalCopy, uint256 _digitalCopyID, bytes32 _transactionID, string memory _text
