const main = async () => {
    const coffeeContractFactory = await hre.ethers.getContractFactory(
      "CustomCharityTest"
    );
    const coffeeContract = await coffeeContractFactory.deploy(
	    "0xF9Fa20f372Fe0CEDEAc3055ac59Fa104806c72Ee",
        "0xF9Fa20f372Fe0CEDEAc3055ac59Fa104806c72Ee",
        "name",
        "charity"
	);
    await coffeeContract.deployed();
    console.log("Charity Contract deployed to:", coffeeContract.address);
  
    /*
     * Get Contract balance
     */
    let contractBalance = await hre.ethers.provider.getBalance(
      coffeeContract.address
    );
    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );
  
    /*
     * Let's NOT try to buy a coffee
     
    const coffeeTxn = await coffeeContract.uen();
    await coffeeTxn.wait();
  

     Get Contract balance to see what happened!

    contractBalance = await hre.ethers.provider.getBalance(
      coffeeContract.address
    );
    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );
  
    let allCoffee = await coffeeContract.getAllCoffee();
    console.log(allCoffee);
	*/
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
};

runMain();