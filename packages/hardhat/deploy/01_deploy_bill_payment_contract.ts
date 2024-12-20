import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { BillPayment } from "../typechain-types";

const deployBillPayment: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("BillPayment", {
    from: deployer,
    args: [], // Деплой контракта без аргумента
    log: true,
    autoMine: true,
  });

  const billPayment = await hre.ethers.getContract<BillPayment>("BillPayment", deployer);
  console.log("Приветствие: ", await billPayment.greeting());
};

export default deployBillPayment;
deployBillPayment.tags = ["BillPayment"];
