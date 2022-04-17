import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";
import charities from '../charities.json';
import { Card } from '@material-ui/core';

import Head from "next/head";
import Link from 'next/link';
// import styles from "../assets/jss/material-kit-react/views/landingPageSections/productStyle.js";
// Import abi
import abi from "../utils/CoffeePortal.json";

export default function Home() {
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0xF9Fa20f372Fe0CEDEAc3055ac59Fa104806c72Ee";

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

  const ROUTE_CHARITY_ID = "charities/[id]"

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
//   const getAllCoffee = async () => {
//     try {
//       const { ethereum } = window;
//       if (ethereum) {
//         const provider = new ethers.providers.Web3Provider(ethereum);
//         const signer = provider.getSigner();
//         const coffeePortalContract = new ethers.Contract(
//           contractAddress,
//           contractABI,
//           signer
//         );

//         /*
//          * Call the getAllCoffee method from your Smart Contract
//          */
//         const coffees = await coffeePortalContract.getAllCoffee();

//         /*
//          * We only need address, timestamp, name, and message in our UI so let's
//          * pick those out
//          */
//         const coffeeCleaned = coffees.map((coffee) => {
//           return {
//             address: coffee.giver,
//             timestamp: new Date(coffee.timestamp * 1000),
//             message: coffee.message,
//             name: coffee.name,
//           };
//         });

//         /*
//          * Store our data in React State
//          */
//         setAllCoffee(coffeeCleaned);
//       } else {
//         console.log("Ethereum object doesn't exist!");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    let coffeePortalContract;
    // getAllCoffee();
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
    <div className="flex flex-col min-h-screen py-2">
      <Head>
        <title>Chari-Dapp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 ">
        <h1 className="text-xxl font-bold text-indigo-600 mb-6">
          Choose a Charity:
        </h1>
        {/* <Link href="/">
          <h2>go to index</h2>
        </Link> */}
           <div className="p-10 grid lg:grid-cols-2 gap-4 ">
        {charities.map(product => {
                    return (
                    <div key={`product-${product.id}`} className="flex-initial w-full justify-center items-stretch self-stretch">

            <div className="flex-initial w-full justify-center items-stretch self-stretch">
          
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 p-4 flex flex-col justify-between leading-normal items-stretch self-stretch">
            <img src={product.img} className="object-contain h-48 w-full content-center" alt="" />
                        <h3 className="text-xl font-serif text-indigo-800 mt-2">{ product.title }</h3>
                        <p className="text-md font-serif mb-5 text-slate-500">{ product.description }</p>
                        {/* <p className="text-lg font-serif">${ product.price }</p> */}
                        
                        <p>
                        <Link href={{
                          pathname: ROUTE_CHARITY_ID,
                          query: {id: product.id}
                        }}>
                        <a className="text-lg bg-indigo-500 hover:bg-blue-700 text-white px-5 py-3 rounded-full">Proceed to Donate</a>
                        
                        </Link>
                        </p>
                    </div>
                    </div>
            </div>
            
       
 
                    );
                })}</div>
                <div className="mb-8">
                {/* <p className="text-sm text-gray-600 flex items-center">
                    <svg className="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                    </svg>
                    Members only
                </p> */}
                
           </div>
         
               
{/* 
        {currentAccount ? (
          <div className="w-full max-w-xs sticky top-3 z-50 ">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="Name"
                  onChange={handleOnNameChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="message"
                >
                  Send the Creator a Message
                </label>

                <textarea
                  className="form-textarea mt-1 block w-full shadow appearance-none py-2 px-3 border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="Message"
                  id="message"
                  onChange={handleOnMessageChange}
                  required
                ></textarea>
              </div>

              <div className="flex items-left justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={buyCoffee}
                >
                  Support $5
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-full mt-3"
            onClick={connectWallet}
          >
            Connect Your Wallet
          </button>

)} */}

{allCoffee.map((coffee, index) => {
  return (
    <div className="border-l-2 mt-10" key={index}>
      <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-blue-800 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">
        {/* <!-- Dot Following the Left Vertical Line --> */}
        <div className="w-5 h-5 bg-blue-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>

        {/* <!-- Line that connecting the box with the vertical line --> */}
        <div className="w-10 h-1 bg-green-300 absolute -left-10 z-0"></div>

        {/* <!-- Content that showing in the box --> */}
        <div className="flex-auto">
          <h1 className="text-md">Supporter: {coffee.name}</h1>
          <h1 className="text-md">Message: {coffee.message}</h1>
          <h3>Address: {coffee.address}</h3>
          <h1 className="text-md font-bold">
            TimeStamp: {coffee.timestamp.toString()}
          </h1>
        </div>
      </div>
    </div>
  );
})}
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