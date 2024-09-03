task("deploy-l2-contracts", "Deploy the L2 contracts")
  .addParam("l1coastalmaps", "The address of L1CoastalMaps")
  .setAction(async (taskArgs) => {

    // Deploy L2CoastalMap
    const L2CoastalMap = await hre.ethers.getContractFactory("L2CoastalMaps");
    const l2CoastalMap = await L2CoastalMap.deploy(taskArgs.l1coastalmaps);
    await l2CoastalMap.deployed();

    console.log("L2CoastalMaps deployed to: ", l2CoastalMap.address);

    // Deploy L2MaidenCoast
    const MaidenCoast = await hre.ethers.getContractFactory("L2MaidenCoast");
    const maidenCoast = await MaidenCoast.deploy(l2CoastalMap.address);
    await maidenCoast.deployed();

    console.log("L2MaidenCoast deployed to: ", maidenCoast.address);

    // Deploy L2LonelyHill
    const LonelyHill = await hre.ethers.getContractFactory("L2LonelyHill");
    const lonelyHill = await LonelyHill.deploy();
    await lonelyHill.deployed();

    console.log("L2LonelyHill deployed to: ", lonelyHill.address);

  });
