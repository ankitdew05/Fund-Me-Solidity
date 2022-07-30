import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

import { Loader } from "./";
import { useState } from "react";
const companyCommonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Welcome = () => {
  const [connect, setConnect] = useState("Connect");
  const [balance, setBalance] = useState("");
  const [ethValue, setethValue] = useState("");
  const connectWallet = async () => {
    if (typeof window.ethereum != "undefined") {
      try {
        const getaccount = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(getaccount);
        setConnect("Connected!");
      } catch (error) {
        console.log(error);
      }
    } else {
      setConnect("Install Meta Mask");
    }
  };

  async function getBalance() {
    if (typeof window.ethereum != "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(contractAddress);
      console.log(ethers.utils.formatEther(balance));
      setBalance(ethers.utils.formatEther(balance));
    }
  }

  const handleSubmit = async () => {
    console.log(ethValue);
    console.log(`Funding with ${ethValue}...`);
    if (typeof window.ethereum != "undefined") {
      //provider, signer/wallet, contract,ABI and address
      const provider = new ethers.providers.Web3Provider(window.ethereum); //for metamsk connection
      const signer = provider.getSigner(); //current account
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const transactionResponse = await contract.fund({
          value: ethers.utils.parseEther(ethValue),
        });
        // listen for tx to be mined or event
        await listenForTranscationMine(transactionResponse, provider);
        console.log("done!");
      } catch (error) {
        console.log(error);
      }
    }
  };

  function listenForTranscationMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`);
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `completed with ${transactionReceipt.confirmations} confirmations.`
        );
        resolve();
      });
    });
  }

  async function withdraw() {
    console.log("Withdrawing...");
    if (typeof window.ethereum != "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const transactionResponse = await contract.withdraw();
        await listenForTranscationMine(transactionResponse, provider);
      } catch (error) {
        console.log(error);
      }
      showBalance.innerHTML = ethers.utils.formatEther(balance);
    } else {
      withdrawButton.innerHTML = "Please install Metamask";
    }
  }

  return (
    <div className="flex w-full h-full justify-around items-center">
      <div className="flex mf:flex-col flex-col items-start justify-around md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Send Crypto <br /> across the world <br /> Fund Me!
          </h1>
          <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
            Explore the crypto world.
          </p>

          <button
            type="button"
            onClick={connectWallet}
            className="flex flex-row justify-center items-center my-5 bg-[#2952e3] p-3 rounded-full cursor-pointer hover:bg-[#2546bd]"
          >
            <AiFillPlayCircle className="text-white mr-2" />
            <p className="text-white text-base font-semibold">{connect}</p>
          </button>
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div>
                <p className="text-white font-light  text-lg">{balance}</p>

                <p className="text-white font-semibold text-lg mt-1">
                  Ethereum
                </p>
                <p className="text-white font-semibold text-[10px] mt-1">
                  0x8B46D0B519Cdf30DDFdccB5F3487bB7728CEeb86
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            {/* <Input placeholder="Address To" name="addressTo" type="text" /> */}
            <input
              placeholder="Amount (ETH)"
              name="amount"
              type="text"
              className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
              onChange={(e) => setethValue(e.target.value)}
              value={ethValue}
            />
            {/* <Input placeholder="Keyword (Gif)" name="keyword" type="text" /> */}
            <div className="h-[1px] w-full bg-gray-400 my-2" />
            <button
              type="button"
              onClick={handleSubmit}
              className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
            >
              Send now
            </button>
            <button
              type="button"
              onClick={getBalance}
              className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
            >
              Get Balance
            </button>
            <button
              type="button"
              onClick={withdraw}
              className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] hover:bg-[#3d4f7c] rounded-full cursor-pointer"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
