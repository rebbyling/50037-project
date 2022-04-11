import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const Web3 = require("web3");


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXMSyanPUvAQUNi0_hpa1Q9X92nLnrNNQ",
    authDomain: "chari-dapp.firebaseapp.com",
    projectId: "chari-dapp",
    storageBucket: "chari-dapp.appspot.com",
    messagingSenderId: "331192825812",
    appId: "1:331192825812:web:802b840dd7fa8171864841"
  };

const firebaseApp = initializeApp(firebaseConfig);
export const firestore = firebaseApp.firestore();
export const auth = firebase.auth();

export function getCharities() {
  var allCharities = [];

  //Populate list of all charities from firestore into allCharities
  firestore
    .collection("charities")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        allCharities.push(doc.data());
      });
    });
  return allCharities;
}

/**
 * Retrieves a specific UEN
 * @param uen is the uen to search for.
 */
/**export function searchByUEN(uen) {
  var charity = [];
  firestore
    .collection("charities")
    .where("UEN", "==", uen)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        charity.push(doc.data());
      });
    });
  return charity;
}
*/

/**
 * Get donations based on donationHash
 * ! Also stores the transaction Hash of the mined transaction
 */
export async function getDonations() {
  const snapshot = await firestore.collection("donations").get();
  return snapshot.docs.map((doc) => doc.data());
}

/**
 * Add donation details to Firestore.
 * ! Also stores the transaction Hash of the mined transaction
 * @param {*} nricHash
 * @param {*} amount
 * @param {*} date
 * @param {*} message
 * @param {*} transactionHash transaction hash of mined transaction
 */
export function addDonation(nricHash, amount, date, message, transactionHash) {
  console.log({ amount: amount, date: date });
  const donationHash = Web3.utils.sha3(
    nricHash.toString() +
    amount.toString() +
    date.toString() +
    message.toString()
  );
  const donationDetails = {
    nricHash: nricHash,
    amount: amount,
    date: date,
    message: message,
    transactionHash: transactionHash,
  };
  console.log(donationDetails);

  return firestore
    .collection("donations")
    .doc(donationHash)
    .set(donationDetails);
}

export async function getDonation(donationHash) {
  return firestore.collection("donations").doc(donationHash).get();
}