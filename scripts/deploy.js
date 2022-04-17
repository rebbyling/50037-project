const main = async () => {
    // JavaScript: web3.js
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
  
    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());
  
    const Token = await hre.ethers.getContractFactory("CustomCharityTest");
    const portal = await Token.deploy(
        "0xfC32dD65B0Db176d9555B9D961F1d7C54391694D",
        "0xfC32dD65B0Db176d9555B9D961F1d7C54391694D",
        "500372022D",
        "char-charity"
    );
    await portal.deployed();
  
    console.log("Contract deployed at address: ", portal.address);
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