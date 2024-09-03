const ethers = require("ethers");
const optimismSDK = require("@eth-optimism/sdk");
require("dotenv").config({ path: "../../../.env" });

const SEPOLIA_RPC_URL = "https://rpc-sepolia-eth.nodeguardians.io";
const OPTIMISM_SEPOLIA_RPC_URL = "https://optimism-sepolia.drpc.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const L1_VALIDATOR_ADDRESS = "0x27B766d6A3d04225231375Ec522b15Ec3EE8cA83";
const L2_MAIDEN_COAST_ADDRESS = "0x2a901C3d43B8b998818a5C113291b02D389C7fd5";

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
};

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
 * Get the LuteMaker1 instance
 * @param {ethers.Wallet} l1Signer
 * @param {ethers.Contract} validator
 * @returns {Promise<ethers.Contract>}
 */
const getLuteMaker1 = async (l1Signer, validator) => {
  const LuteMakerAddress = await validator.deployments(l1Signer.address, 1);
  const LuteMakerABI =
    require("../artifacts/contracts_/private/LuteMaker1.sol/LuteMaker1.json").abi;
  const LuteMaker = new ethers.Contract(
    LuteMakerAddress,
    LuteMakerABI,
    l1Signer
  );
  return LuteMaker;
};

/**
 * Get the L2MaidenCoast instance
 * @param {ethers.Wallet} l2Signer
 * @returns {Promise<ethers.Contract>}
 */
const getMaidenCoast = async (l2Signer) => {
  const maidenCoastABI =
    require("../artifacts/contracts_/private/L2MaidenCoast.sol/L2MaidenCoast.json").abi;
  const maidenCoast = new ethers.Contract(
    L2_MAIDEN_COAST_ADDRESS,
    maidenCoastABI,
    l2Signer
  );
  return maidenCoast;
};

/**
 * Get the L2CoastalMaps instance
 * @param {ethers.Contract} maidenCoast
 * @returns {Promise<ethers.Contract>}
 */
const getL2CoastalMaps = async (l2Signer, maidenCoast) => {
  const l2TokenAddress = await maidenCoast.coastalMaps();
  const l2TokenABI =
    require("../artifacts/contracts_/utils/L2CoastalMaps.sol/L2CoastalMaps.json").abi;
  const l2Token = new ethers.Contract(
    l2TokenAddress,
    l2TokenABI,
    l2Signer
  );
  return l2Token;
};

/**
 * Get the L1CoastalMaps instance
 * @param {ethers.Wallet} l1Signer
 * @param {ethers.Contract} validator
 * @returns {Promise<ethers.Contract>}
 */
const getL1CoastalMaps = async (l1Signer, validator) => {
  const l1TokenAddress = await validator.l1CoastalMaps();
  const l1TokenABI =
    require("../artifacts/contracts_/utils/L1CoastalMaps.sol/L1CoastalMaps.json").abi;
  const l1Token = new ethers.Contract(
    l1TokenAddress, 
    l1TokenABI, 
    l1Signer
  );
  return l1Token;
};

/**
 * Get the L1ERC721Bridge instance
 * @param {ethers.Wallet} l1Signer
 * @returns {Promise<ethers.Contract>}
 */
const getL1ERC721Bridge = async (l1Signer) => {
  const l1ERC721BridgeDeployment = require(
    "@eth-optimism/contracts-bedrock/deployments/sepolia/L1ERC721BridgeProxy.json"
  );
  const l1ERC721BridgeAddress = l1ERC721BridgeDeployment.address;
  const l1ERC721BridgeABI =
    require("@eth-optimism/contracts-bedrock/forge-artifacts/L1ERC721Bridge.sol/L1ERC721Bridge.json").abi;
  const l1ERC721Bridge = new ethers.Contract(
    l1ERC721BridgeAddress,
    l1ERC721BridgeABI,
    l1Signer
  );
  return l1ERC721Bridge;
};

async function main() {
  const [l1Signer, l2Signer] = await getSigners();

  console.log("l1Signer.address: ", l1Signer.address);
  console.log("l2Signer.address: ", l2Signer.address);

  const crossChainMessenger = await setup(l1Signer, l2Signer);

  // =============================================================
  // Deploy LuteMaker1
  // =============================================================

  const validator = await getValidator(l1Signer);
  const deployTx = await validator.deploy(1);
  const deployReceipt = await deployTx.wait();

  const tokenId = ethers.BigNumber.from(deployReceipt.events[0].topics[3]);

  console.log("LuteMaker1 deployed to: ", await validator.deployments(l1Signer.address, 1));
  console.log("L1CoastalMap ID: ", tokenId.toString());

  // =============================================================
  // Get the Lutemaker and L1CoastalMaps instances
  // =============================================================

  const luteMaker = await getLuteMaker1(l1Signer, validator);
  const l1CoastalMaps = await getL1CoastalMaps(l1Signer, validator);

  // =============================================================
  // Get the L2MaidenCoast and L2CoastalMaps instance
  // =============================================================

  const maidenCoast = await getMaidenCoast(l2Signer);
  const l2CoastalMaps = await getL2CoastalMaps(l2Signer, maidenCoast);

  // =============================================================
  // Get the L1ERC721Bridge
  // =============================================================

  const l1ERC721Bridge = await getL1ERC721Bridge(l1Signer);

  // =============================================================
  // Bridge the NFT to L2 and wait for the L1 message to be sent
  // =============================================================

  let approveTx = await l1CoastalMaps.approve(l1ERC721Bridge.address, tokenId);
  await approveTx.wait();

  console.log("Bridging CoastalMap NFT to L2...");
  const bridgeTx = await l1ERC721Bridge.bridgeERC721(
    l1CoastalMaps.address,
    l2CoastalMaps.address,
    tokenId,
    400000,
    []
  );
  await bridgeTx.wait();

  console.log("Waiting for token to be bridged...");

  await crossChainMessenger.waitForMessageStatus(
    bridgeTx.hash,
    optimismSDK.MessageStatus.RELAYED,
    {
      fromBlockOrBlockHash: bridgeTx.blockHash,
    }
  );

  console.log("Token bridged to L2");

  // =============================================================
  // Unlock the first secret on L2 now that the NFT is bridged
  // =============================================================

  const harpyHair = await maidenCoast.getHarpyHair();
  console.log("Harpy Hair: ", harpyHair);

  // =============================================================
  // Give the materials to the LuteMaker1
  // =============================================================

  const giveHarpyHairsTx = await luteMaker.giveHarpyHair(harpyHair);
  await giveHarpyHairsTx.wait();

  console.log(
    "Harpy hair given to the LuteMaker:", 
    await luteMaker.hairGiven()
  );

}

main();
