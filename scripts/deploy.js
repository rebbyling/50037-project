const main = async () => {
    // JavaScript: web3.js
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
  
    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());
  
    const Token = await hre.ethers.getContractFactory("CoffeePortal");
    const portal = await Token.deploy(
		"0xADC29Ad6D646c0c7CA7BF7aDf2EEE095ef99d1F8", 
		);
    await portal.deployed();
  
    console.log("Onboarding address: ", portal.address);

  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();