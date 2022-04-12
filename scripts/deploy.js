const main = async () => {
    // JavaScript: web3.js
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
  
    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());
  
    const Token = await hre.ethers.getContractFactory("CustomCharityTest");
    const portal = await Token.deploy(
        "0xF9Fa20f372Fe0CEDEAc3055ac59Fa104806c72Ee",
        "0xF9Fa20f372Fe0CEDEAc3055ac59Fa104806c72Ee",
        "name",
        "charity"
    );
    await portal.deployed();
  
    console.log("CoffeePortal address: ", portal.address);
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