// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0;

import "hardhat/console.sol"; // if we're still planning on using hardhat
// see if you can deploy the contract with CustomOnboarding

contract CustomCharityTest{
    address admin;  // Admin for the smart contract, could be admin of charity
    address payable public charityaddress; // Where the payments actually go to
    string public uen; // Charity's UEN, e.g. 12345678A
    string public charityname; // For display purposes
    uint256 public donationcount;
    address[] public donors; // List of all charity donors 

    // Table of all owners
    mapping(address => bool) owners;

    // Maps each donor's address with the total donation counts 
    mapping(address => uint256) donationCounts;

    // More advanced donation storing method that we probably don't need
    // mapping(bytes32 => mapping(uint256 => Donation)) donations;
    
    constructor(address _admin, address payable _charityaddress, string memory _uen, string memory _charityname) {
        // Create an instance of this contract for one charity
        admin = _admin;
        charityaddress = _charityaddress;
        uen = _uen;
        charityname = _charityname;
        owners[_admin] = true;
        owners[_charityaddress] = true;
        // TODO: Check if making the constructor payable has any effect on security.
    }

    // Section for handling on-chain payments

    event NewOnchainPayment(
        address indexed from, // keyword indexed lets you search by the parameter
        string message,
        uint256 timestamp,
        uint256 amount
        // string name // omitted for the time being, privacy
    );

    struct OnchainPayment{
        address donor;
        string message;
        uint256 timestamp;
        uint256 amount; // WARNING: THIS IS IN WEI. Need to convert to ETH on presentation side.
    }

    OnchainPayment[] onchainPayment; // Stores all the donations in an unindexed list, just in-order

    function MakeOnchainPayment (string memory _message) public payable {
        // checks
        uint256 cost = 0.001 ether; // minimum amount to make sure gas doesn't eat the whole thing
        require(msg.value >= cost, "Value too low to send!");

        // effects
        console.log("Making onchain transfer...");

        require(msg.sender.balance >= msg.value, "You don't have enough ether for this!");
        donationcount += 1;
        onchainPayment.push(OnchainPayment(msg.sender, _message, block.timestamp, msg.value));
        emit NewOnchainPayment(msg.sender, _message, block.timestamp, msg.value);
        uint size = donationCounts[msg.sender];
        if (size == 0){
            donors.push(msg.sender);
        }
        donationCounts[msg.sender] = size + 1;

        // re-ordered to prevent re-entrance attacks
        (bool success, ) = charityaddress.call{value: msg.value}("");
        require(success, "Failed to send money");
        console.log("Transaction complete");
    }

    // Helper functions

    function GetOnlinePayments() public view returns (OnchainPayment[] memory){
        // Returns the whole list of transactions.
        return onchainPayment;
    }

    function GetDonorDonations(address _address) public view returns (uint256){
        // This returns the number of donations made by a single address. This does not account for the size of donations.
        return donationCounts[_address];
    }

    function GetNumOnlinePayments() public view returns (uint256){
        // This returns the number of payments received in total. Legacy function.
        return donationcount;
    }

    function GetDonors() public view returns (address[] memory){
        // This returns a list of all donors. Legacy function.
        return donors;
    }

    // Admin functions
    modifier isAdmin {
      require(msg.sender == admin, "Only admin can access this function");
      _;
    }
    
    modifier isOwners {
    require(owners[msg.sender], "Only owners can access this function");
      _;
    }

    function addOwner(address owner) public isAdmin {
      owners[owner] = true;
    }

    function checkOwner(address owner) public view returns (bool) {
      return owners[owner];
    } 

    function removeOwner(address owner) public isAdmin {
      owners[owner] = false;
    }

    function updateAddress(address payable _oldaddress, address payable _newaddress) public isAdmin {
        require(charityaddress == _oldaddress, "Addresses do not match!");
        owners[_oldaddress] = false;
        owners[_newaddress] = true;
        charityaddress = _newaddress;
    }

    function updateName(string memory _newname) public isOwners returns(string memory) {
        charityname = _newname;
        return charityname;
    }        

}