const ethers = require("ethers");
const optimismSDK = require("@eth-optimism/sdk");
require("dotenv").config({ path: "../../../.env" });

const SEPOLIA_RPC_URL = "https://rpc-sepolia-eth.nodeguardians.io";
const OPTIMISM_SEPOLIA_RPC_URL = "https://optimism-sepolia.drpc.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const L1_VALIDATOR_ADDRESS = "0x27B766d6A3d04225231375Ec522b15Ec3EE8cA83";
const L2_LONELY_HILL_ADDRESS = "0x67df80515AF58B78b1e71524F02769F0F92ec122";

/**
 * Get the L1 and L2 signers
 * @returns {Promise<[ethers.Wallet, ethers.Wallet]>}
 */
const getSigners = async () => {
  const l1RpcProvider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
  const l2RpcProvider = new ethers.providers.JsonRpcProvider(
    OPTIMISM_SEPOLIA_RPC_URL
  );
  const l1Wallet = new ethers.Wallet(PRIVATE_KEY, l1RpcProvider);
  const l2Wallet = new ethers.Wallet(PRIVATE_KEY, l2RpcProvider);

  return [l1Wallet, l2Wallet];
};

/**
 * Get the CrossChainMessenger instance
 * @param {ethers.Wallet} l1Signer
 * @param {ethers.Wallet} l2Signer
 * @returns {Promise<optimismSDK.CrossChainMessenger>}
 */
const setup = async (l1Signer, l2Signer) => {
  let crossChainMessenger = new optimismSDK.CrossChainMessenger({
    l1ChainId: await l1Signer.getChainId(), // Sepolia value, 1 for mainnet
    l2ChainId: await l2Signer.getChainId(), // Sepolia value, 10 for mainnet
    l1SignerOrProvider: l1Signer,
    l2SignerOrProvider: l2Signer,
  });

  return crossChainMessenger;
}; // setup

/**
 * Get the validator instance
 * @param {ethers.Wallet} l1Signer
 * @returns {Promise<ethers.Contract>}
 */
const getValidator = async (l1Signer) => {
  const validatorABI =
    require("../artifacts/contracts_/utils/Validator.sol/Validator.json").abi;
  const validator = new ethers.Contract(
    L1_VALIDATOR_ADDRESS,
    validatorABI,
    l1Signer
  );
  return validator;
};

/**
 * Get the LuteMaker2 instance
 * @param {ethers.Wallet} l1Signer
 * @param {ethers.Contract} validator
 * @returns {Promise<ethers.Contract>}
 */
const getLuteMaker2 = async (l1Signer, validator) => {
  const LuteMakerAddress = await validator.deployments(l1Signer.address, 2);
  const LuteMakerABI =
    require("../artifacts/contracts_/private/LuteMaker2.sol/LuteMaker2.json").abi;
  const LuteMaker = new ethers.Contract(
    LuteMakerAddress,
    LuteMakerABI,
    l1Signer
  );
  return LuteMaker;
};

/**
 * Get the Highlands instance
 * @param {ethers.Wallet} l2Signer
 * @returns {Promise<ethers.Contract>}
 */
const getLonelyHill = async (l2Signer) => {
  const lonelyHillABI =
    require("../artifacts/contracts_/private/L2LonelyHill.sol/L2LonelyHill.json").abi;
  const lonelyHill = new ethers.Contract(
    L2_LONELY_HILL_ADDRESS,
    lonelyHillABI,
    l2Signer
  );
  return lonelyHill;
};

/**
 * Get the L1CrossDomainMessenger instance
 * @param {ethers.Wallet} l1Signer
 * @returns {Promise<ethers.Contract>}
 */
const getL1CrossDomainMessenger = async (l1Signer) => {
  const l1CrossDomainMessengerDeployment = require("@eth-optimism/contracts-bedrock/deployments/sepolia/L1CrossDomainMessengerProxy.json");
  const l1CrossDomainMessengerAddress =
    l1CrossDomainMessengerDeployment.address;
  const l1CrossDomainMessengerABI =
    require("@eth-optimism/contracts-bedrock/forge-artifacts/L1CrossDomainMessenger.sol/L1CrossDomainMessenger.json").abi;
  const l1CrossDomainMessenger = new ethers.Contract(
    l1CrossDomainMessengerAddress,
    l1CrossDomainMessengerABI,
    l1Signer
  );
  return l1CrossDomainMessenger;
};

/**
 * Get the L2CrossDomainMessenger instance
 * @param {ethers.Wallet} l1Signer
 * @returns {Promise<ethers.Contract>}
 */
const getL2CrossDomainMessenger = async (l2Signer) => {
  const l2CrossDomainMessengerAddress =
    "0x4200000000000000000000000000000000000007";
  const l2CrossDomainMessengerABI =
    require("@eth-optimism/contracts-bedrock/forge-artifacts/L2CrossDomainMessenger.sol/L2CrossDomainMessenger.json").abi;
  const l2CrossDomainMessenger = new ethers.Contract(
    l2CrossDomainMessengerAddress,
    l2CrossDomainMessengerABI,
    l2Signer
  );
  return l2CrossDomainMessenger;
};

async function main() {
  const [l1Signer, l2Signer] = await getSigners();

  console.log("l1Signer.address: ", l1Signer.address);
  console.log("l2Signer.address: ", l2Signer.address);

  const crossChainMessenger = await setup(l1Signer, l2Signer);

  // =============================================================
  // Deploy LuteMaker2
  // =============================================================

  const validator = await getValidator(l1Signer);
  const deployTx = await validator.deploy(2);
  await deployTx.wait();

  console.log(
    "LuteMaker2 deployed to: ", 
    await validator.deployments(l1Signer.address, 2)
  );

  // =============================================================
  // Get the L1CrossDomainMessenger instance
  // =============================================================

  const l1CrossDomainMessenger = await getL1CrossDomainMessenger(l1Signer);

  // =============================================================
  // Get the LuteMaker2 instance
  // =============================================================

  const luteMaker = await getLuteMaker2(l1Signer, validator);

  // =============================================================
  // Get the L2LonelyHill instance
  // =============================================================

  const lonelyHill = await getLonelyHill(l2Signer);

  // =============================================================
  // Send a message to L2 to cut singing tree
  // =============================================================

  const l1ToL2Data = lonelyHill.interface.encodeFunctionData(
    "cutSingingTree", 
    [ l2Signer.address ]
  );

  console.log("Sending message to L2...");
  const l1ToL2Tx = await l1CrossDomainMessenger.sendMessage(
    lonelyHill.address,
    l1ToL2Data,
    500000
  );
  await l1ToL2Tx.wait();

  await crossChainMessenger.waitForMessageStatus(
    l1ToL2Tx.hash,
    optimismSDK.MessageStatus.RELAYED,
    {
      fromBlockOrBlockHash: l1ToL2Tx.blockHash,
    }
  );

  console.log("Message sent to L2");

  // =============================================================
  // Get singing wood on L2 now that the message is relayed
  // =============================================================

  const singingWood = await lonelyHill.getSingingWood();
  console.log("Singing Wood: ", singingWood);

  // =============================================================
  // Give the materials to the LuteMaker
  // =============================================================

  const giveSingingWoodTx = await luteMaker.giveSingingWood(singingWood);
  await giveSingingWoodTx.wait();

  console.log(
    "Singing wood given to the LuteMaker:",
    await luteMaker.woodGiven()
  );

}

main();
