import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";

import Head from "next/head";
import Link from 'next/link';
// Import abi
import abi from "../utils/CoffeePortal.json";

export default function Home() {
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  // const contractAddress = "0xF9Fa20f372Fe0CEDEAc3055ac59Fa104806c72Ee";
  const contractAddress = "0x781C51B9826c2aA90EFF27e86D259ca4068cc0Ea";

  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;

  /*
   * Just a state variable we use to store our user's public wallet.
   */
  const [currentAccount, setCurrentAccount] = useState("");

  const [message, setMessage] = useState("");

  const [name, setName] = useState("");

  /*
   * All state property to store all coffee
   */
  const [allCoffee, setAllCoffee] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        toast.success("🦄 Wallet is Connected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.warn("Make sure you have MetaMask Connected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error(`${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        toast.warn("Make sure you have MetaMask Connected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const buyCoffee = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const coffeePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await coffeePortalContract.getTotalCoffee();
        console.log("Retrieved total coffee count...", count.toNumber());

        /*
         * Execute the actual coffee from your smart contract
         */
        const coffeeTxn = await coffeePortalContract.buyCoffee(
          message ? message : "Enjoy Your Coffee",
          name ? name : "Anonymous",
          ethers.utils.parseEther("0.001"),
          {
            gasLimit: 300000,
          }
        );
        console.log("Mining...", coffeeTxn.hash);

        toast.info("Sending Fund for coffee...", {
          position: "top-left",
          autoClose: 18050,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        await coffeeTxn.wait();

        console.log("Mined -- ", coffeeTxn.hash);

        count = await coffeePortalContract.getTotalCoffee();

        console.log("Retrieved total coffee count...", count.toNumber());

        setMessage("");
        setName("");

        toast.success("Coffee Purchased!", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      toast.error(`${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  /*
   * Create a method that gets all coffee from your contract
   */
  const getAllCoffee = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const coffeePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        /*
         * Call the getAllCoffee method from your Smart Contract
         */
        const coffees = await coffeePortalContract.getAllCoffee();

        /*
         * We only need address, timestamp, name, and message in our UI so let's
         * pick those out
         */
        const coffeeCleaned = coffees.map((coffee) => {
          return {
            address: coffee.giver,
            timestamp: new Date(coffee.timestamp * 1000),
            message: coffee.message,
            name: coffee.name,
          };
        });

        /*
         * Store our data in React State
         */
        setAllCoffee(coffeeCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    let coffeePortalContract;
    getAllCoffee();
    checkIfWalletIsConnected();

    const onNewCoffee = (from, timestamp, message, name) => {
      console.log("NewCoffee", from, timestamp, message, name);
      setAllCoffee((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
          name: name,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      coffeePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      coffeePortalContract.on("NewCoffee", onNewCoffee);
    }

    return () => {
      if (coffeePortalContract) {
        coffeePortalContract.off("NewCoffee", onNewCoffee);
      }
    };
  }, []);

  const handleOnMessageChange = (event) => {
    const { value } = event.target;
    setMessage(value);
  };
  const handleOnNameChange = (event) => {
    const { value } = event.target;
    setName(value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Chari-DApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-xxl font-bold text-indigo-600 mb-6">
          Chari-DApp
        </h1>
        
        {/*
         * If there is currentAccount render this form, else render a button to connect wallet
         */}

        {currentAccount ? (
          <><p className="text-lg text-slate-800 mb-8">You have already connected your wallet! 👏🏼 </p>
          <Link href="/dashboard">
            <a className="bg-indigo-500 text-lg hover:bg-indigo-700 text-white py-2 px-4 rounded-full mt-3">Browse Charities</a>
          </Link></>
        ) : (
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white text-lg py-2 px-4 rounded-full mt-3"
            onClick={connectWallet}
          >
            Connect Your Wallet
          </button>

)}


</main>
<ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
/>
</div>
);
}