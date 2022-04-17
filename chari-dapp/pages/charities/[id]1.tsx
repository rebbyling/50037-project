port React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";
import charities from '../../charities.json';
import Head from "next/head";
import Link from 'next/link';

// Import abi
//import abi from "../../utils/CoffeePortal.json";
import abi from "../../charities.json";
import { Router, useRouter } from "next/router";

export default function Home() {
  /**
   * Create a variable here that holds the contract address after you deploy!
   */

  // need to change address
  // const contractAddress = "0xF9Fa20f372Fe0CEDEAc3055ac59Fa104806c72Ee";
  const contractAddress = "0x781C51B9826c2aA90EFF27e86D259ca4068cc0Ea";
  const router = useRouter();

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
  const [allDonation, setAllDonation] = useState([]);

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




  const donateCharity = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const CustomCharityTestContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await CustomCharityTestContract.GetNumOnlinePayments();
        console.log("Retrieved total coffee count...", count.toNumber());




        /*
         * Execute the actual coffee from your smart contract
         */
        const charityTxn = await CustomCharityTestContract.buyCoffee(
          message ? message : "Thank you for your kind generosity",
          //name ? name : "Anonymous",
          ethers.utils.parseEther("0.001"),
          {
            gasLimit: 300000,
          }
        );
        console.log("Mining...", charityTxn.hash);

        toast.info("Sending donations...", {
          position: "top-left",
          autoClose: 18050,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        await charityTxn.wait();

        console.log("Mined -- ", charityTxn.hash);

        count = await CustomCharityTestContract.GetDonorDonations();

        console.log("Retrieved total donation count...", count.toNumber());

        setMessage("");
        setName("");

        toast.success("Donation Made!", {
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
        const CustomCharityTestContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        /*
         * Call the getAllCoffee method from your Smart Contract
         */
        const coffees = await CustomCharityTestContract.GetOnlinePayments();

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
        SetOnlinePayments(coffeeCleaned);
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
    let CustomCharityTestContract: ethers.Contract;
    GetOnlinePayments();
    checkIfWalletIsConnected();

    const NewOnchainPayment = (from, timestamp, message) => {
      console.log("New Donation", from, timestamp, message);
      SetOnlinePayments((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };




    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      CustomCharityTestContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      CustomCharityTestContract.on("NewCoffee", NewOnchainPayment);
    }

    return () => {
      if (CustomCharityTestContract) {
        CustomCharityTestContract.off("NewCoffee", NewOnchainPayment);
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




  const charity = charities.map((product) => {
      return {
        title: product.title
      };
  });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Charity Details</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
      <h1 className="text-xxl font-bold text-indigo-600 mb-6">
        {router.query.id}
                          </h1>

        
        <Link href="/dashboard">
          <a className="bg-slate-400 hover:bg-indigo-700 text-white py-2 px-3 rounded-full mt-3">Back to dashboard</a>
        </Link>
        {/*
         * If there is currentAccount render this form, else render a button to connect wallet
         */}

        {currentAccount ? (
          <div className="w-full max-w-xs sticky top-3 z-50 ">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label
                  className="block text-indigo-700 text-md font-bold mb-2"
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
                  className="block text-indigo-700 text-md font-bold mb-2"
                  htmlFor="message"
                >
                  Add a Message
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
                  className="bg-indigo-500 hover:bg-indigo-700 text-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={donateCharity}
                >
                  Support Now!
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 px-3 rounded-full mt-3"
            onClick={connectWallet}
          >
            Connect Your Wallet
          </button>

)}

{allDonations.map((coffee, index) => {
  return (
    <div className="border-l-2 mt-10" key={index}>
      <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-indigo-200 text-indigo-900 rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">
        {/* <!-- Dot Following the Left Vertical Line --> */}
        <div className="w-5 h-5 bg-indigo-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>

        {/* <!-- Line that connecting the box with the vertical line --> */}
        <div className="w-10 h-1 bg-yellow-300 absolute -left-10 z-0"></div>

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