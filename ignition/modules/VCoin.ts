import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VCoinModule = buildModule("VCoin", (m) => {
  const tokenSupply = "10000";
  const VCoin = m.contract("VCoin", [tokenSupply]);
  return { VCoin };
});

export default VCoinModule;
