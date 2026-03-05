const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying TrustLoan contract...");

    const TrustLoan = await hre.ethers.getContractFactory("TrustLoan");
    const trustLoan = await TrustLoan.deploy();

    await trustLoan.waitForDeployment();

    const address = await trustLoan.getAddress();
    console.log(`✅ TrustLoan deployed to: ${address}`);
    console.log(`   Network: ${hre.network.name}`);
    console.log(`   Block: ${await hre.ethers.provider.getBlockNumber()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
