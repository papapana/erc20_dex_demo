import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import VCoinModule from "./VCoin";

export const DexModule = buildModule("Dex", (m) => {
  const { VCoin } = m.useModule(VCoinModule);
  const price = BigInt(100);
  // Fix: Use VCoin directly, not wrapped in an array
  const dex = m.contract("DEX", [price, VCoin]);
  return { dex };
});

export default DexModule;
