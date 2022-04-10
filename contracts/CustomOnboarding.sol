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
        address cAddress;
        bool exists;
    }

    mapping (string => Charity) private charities; // map UEN to charity address

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
    string memory CharityName) public isAdmin {
        address ContractAddress = address(new CustomCharityTest(CharityAdmin, CharityAddress, UEN, CharityName));
        charities[UEN].cAddress = CharityAddress;
        charities[UEN].exists = true;
        emit ContractCreated(ContractAddress);
    }    

    function UpdateCharityAddress(string memory UEN, address newAddress) public isAdmin{
        require(charities[UEN].exists == true, "This charity does not exist!");
        charities[UEN].cAddress = newAddress;
    }

    function getCharityAddress(string memory UEN) public view returns (address){
        return charities[UEN].cAddress;
    }
}