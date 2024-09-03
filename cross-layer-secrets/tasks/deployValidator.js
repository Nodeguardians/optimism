task("deploy-validator", "Deploy the validator").setAction(async () => {
    const Validator = await hre.ethers.getContractFactory("Validator");
    const validator = await Validator.deploy();
    await validator.deployed();

    console.log("Validator deployed to: ", validator.address);
    console.log("L1CoastalMaps deployed to: ", await validator.l1CoastalMaps());
});