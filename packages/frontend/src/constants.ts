export const INFURA_ID = "LEGG inn DIN INFRURA ID HER";

export const NETWORKS = {
    localhost: {
      name: "localhost",
      color: "#666666",
      chainId: 31337,
      blockExplorer: "",
      rpcUrl: "http://" + window.location.hostname + ":8545",
    },
    mainnet: {
      name: "mainnet",
      color: "#ff8b9e",
      chainId: 1,
      rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
      blockExplorer: "https://etherscan.io/",
    },
    goerli: {
      name: "goerli",
      color: "#0975F6",
      chainId: 5,
      faucet: "https://goerli-faucet.slock.it/",
      blockExplorer: "https://goerli.etherscan.io/",
      rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
    },
    sepolia: {
      name: "sepolia",
      color: "#0975F6",
      chainId: 11155111,
      faucet: "https://faucet.sepolia.dev/",
      blockExplorer: "https://sepolia.etherscan.io/",
      rpcUrl: `https://sepolia.infura.io/v3/${INFURA_ID}`,
    },
};