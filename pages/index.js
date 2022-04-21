import { useState, useEffect } from "react";
const ethers = require("ethers");

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("Null");
  const [accountBalance, setAccountBalance] = useState(null);

  useEffect(() => {
    window.ethereum.on('accountsChanged', handleAccountsChanged)
    handleReload()
  }, []);

  useEffect(() => {
    updateETHBalance();
  }, [currentAccount]);

  const handleAccountsChanged = (a) => {
    setCurrentAccount(a[0])
  }

  const handleReload = async () => {
     if (window.ethereum) {
       const accounts = await window.ethereum.request({
         method: "eth_accounts",
       });
       if (accounts[0] != undefined) {
         setCurrentAccount(accounts[0])
         setIsConnected(true)
       }
     }
  }

  const handleConnect = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts) {
        setCurrentAccount(accounts[0]);
        setIsConnected(true);
      }
    } else {
      alert("please install metamask");
    }
  };

  const updateETHBalance = async () => {
    try {
      if (window.ethereum) {
        const balanceHash = await window.ethereum.request({
          method: "eth_getBalance",
          params: [currentAccount, "latest"],
        });
        const balance = parseInt(balanceHash) / Math.pow(10, 18);
        console.log(balance);
        setAccountBalance(balance);
      }
    } catch (err) {}
  };

  return (
    <div className="flex flex-col items-center justify-evenly p-10 my-10">
      {isConnected ? (
        <div>
          <h1 className="m-5 bg-blue-100 px-4 py-2 rounded-md">
            {`${currentAccount.substring(0, 4)}...${currentAccount.substring(
              currentAccount.length - 4
            )}`}
          </h1>

          <h2>balance: {String(accountBalance).substring(0, 5)} ETH</h2>
        </div>
      ) : (
        <button
          className="bg-gray-200 px-4 py-2 rounded-xl mx-3"
          onClick={handleConnect}
        >
          Connect wallet
        </button>
      )}
    </div>
  );
}
