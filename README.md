# Chari-DApp Project
## Submission for 50.037 DApp Project
Group: group_name

## Rationale of Application:
Currently, the process of donating to charitable causes via centralised platforms is highly problematic. These platforms often lack the transparency necessary to assure users that their donations have actually been sent to their desired platform. In addition, most platforms often take a cut of every transaction as part of “platform fees”. 

As blockchain represents a transparent, decentralised platform, with fast transaction speeds and low transaction fees, it is well suited for a donation platform, especially in cases of emergency aid where large sums of money need to be transacted rapidly. In addition, as transactions are transparent on typical blockchain networks, it is easy for users to track how their donations are being used (at least on-chain). Finally, as blockchain transactions are immutable, unscrupulous donors cannot issue chargebacks after making donations.

## Running the App:
1. Install required dependencies using `npm install --save-dev hardhat`
2. Run it on localhost:3000 using `npm run dev`
3. If you wish to deploy the Smart Contract, run `npx hardhat run scripts/deploy.js --network ropsten`

## How it works:
Chari-DApp is very simple to use! You will only need to
1. Connect your metamask wallet
2. Browse Charities
3. Choose a charity, enter a donation amount and message, and donate!
