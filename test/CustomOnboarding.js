const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("dApp contract", function () {
  it("Deployment should set up a smart contract that creates other smart contracts", async function () {
    const [owner] = await ethers.getSigners();

    const Onboarding = await ethers.getContractFactory("CustomOnboarding");

    const hardhatOnboarding = await Onboarding.deploy(
		"0xADC29Ad6D646c0c7CA7BF7aDf2EEE095ef99d1F8", 
		);

  });
});