// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;
import "./CustomCharityTest.sol"; // please modify this if needed!
import "hardhat/console.sol"; // if we're still planning on using hardhat

contract CustomOnboarding{
    address private admin;


    /*
        If you're wondering why this has to be done like this, it's because of how Solidity handles mappings.
    */
    struct Charity{
        address donationAddress;
        address contractAddress;
        bool exists;
    }

    mapping (string => Charity) private charities; // map UEN to charity STRUCT

    constructor(address _admin) {
        admin = _admin;
    }
  
    modifier isAdmin {
        require(msg.sender == admin, "Only admin can access this function");
        _;
    }

    /* 
        This allows a web3 hook to pick up on the address of the new contract created during onboarding.
        The event will be emitted if contract creation is successful. Returning the new address as part
        of the function does not work. It's an oddity of solidity.
        See https://ethereum.stackexchange.com/questions/45502/get-address-of-new-contract-from-contract-factory
    */
    event ContractCreated (address NewContractAddress);

    // This onboards the charity.
    function OnboardCharity(address CharityAdmin, 
    address payable CharityAddress, 
    string memory UEN, 
    string memory CharityName) public isAdmin{
        address ContractAddress = address(new CustomCharityTest(CharityAdmin, CharityAddress, UEN, CharityName));
        emit ContractCreated(ContractAddress);
        charities[UEN].donationAddress = CharityAddress;
        charities[UEN].contractAddress = ContractAddress;
        charities[UEN].exists = true;
    }    

    function UpdateCharityAddress(string memory UEN, address newAddress) public isAdmin{
        require(charities[UEN].exists == true, "This charity does not exist!");
        charities[UEN].donationAddress = newAddress;
    }

    function RemoveCharity(string memory UEN) public isAdmin{
        charities[UEN].exists = false;
        // Further work: Improve "child" smart contract transactions to FAIL if UEN no longer on the list
    }

    function getCharityAddress(string memory UEN) public view returns (address){
        require(charities[UEN].donationAddress != address(0), "UEN does not exist!");
        return charities[UEN].donationAddress;
    }

    function getContractAddress(string memory UEN) public view returns (address){
        require(charities[UEN].contractAddress != address(0), "UEN does not exist!");
        return charities[UEN].contractAddress;
    }
}