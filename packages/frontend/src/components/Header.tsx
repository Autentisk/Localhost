import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Popover } from "antd";
import { ethers } from "ethers";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const { Header } = Layout;

const AppHeader = () => {
  const location = useLocation();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const network = "localhost";
  const balance = "10$";

  const content = (
    <div>
      <p>Network: {network}</p>
      <p>Balance: {balance}</p>
    </div>
  );

  const key =
    location.pathname === "/transfer"
      ? "2"
      : location.pathname === "/sellitem"
      ? "3"
      : location.pathname === "/review"
      ? "4"
      : location.pathname === "/burn"
      ? "5"
      : location.pathname === "/verify"
      ? "6"
      : "1";

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log(signer);
        setSelectedAddress(addressArray[0]);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      // Automatically try to connect to get user's account
      connectWallet();
    }
  }, []); // Empty array means this useEffect will only run once, when the component is first mounted

  const shortenAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(address.length - 4);
  };

  return (
    <Layout className="layout">
      <Header className="header-content">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[key]} className="custom-menu">
          <Menu.Item key="1">
            <Link to="/homepage">List your items</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/transfer">Transfer items</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/sellitem">Sell an item</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/review">Add a review</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/burn">Delete an item</Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to="/verify">Look up owner</Link>
          </Menu.Item>
        </Menu>
        {!selectedAddress ? (
          <div className="connectButton">
            <Button type="primary" onClick={connectWallet}>
              Connect
            </Button>
          </div>
        ) : (
          <Popover content={content} className="popoverButton" title="Information">
            <Button type="primary">Connected: {shortenAddress(selectedAddress)}</Button>
          </Popover>
        )}
      </Header>
    </Layout>
  );
};

export default AppHeader;
