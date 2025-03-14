# ERC20 Token DEX Demo

This project demonstrates a simple decentralized exchange (DEX) implementation that allows users to purchase an ERC20 token (VCoin) with Ether. The project includes the token contract, DEX contract, tests, and deployment scripts using Hardhat Ignition.

## Overview

- **VCoin (VC)**: A simple ERC20 token implementation based on OpenZeppelin's ERC20 standard
- **DEX**: A decentralized exchange contract that allows:
  - Token purchase with ETH at a fixed price
  - Liquidity provision by the owner
  - ETH withdrawals by the owner

## Frontend
You can visit the frontend [here](https://papapana.github.io/erc20_dex_demo/).

## Features

- Fixed price token exchange
- Owner-controlled liquidity provision
- Comprehensive test coverage
- Hardhat Ignition deployment modules

## Getting Started

### Prerequisites

- Node.js and npm
- Git

### Installation

```bash
# Clone this repository
git clone <repository-url>
cd erc20_dex_demo

# Install dependencies
npm install
```

### Running Tests

```bash
# Run all tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test
```

### Local Deployment

Start a local Hardhat node:

```bash
npx hardhat node
```

In a new terminal window, deploy the contracts using Hardhat Ignition:

```bash
npx hardhat ignition deploy ./ignition/modules/Dex.ts
```

This will deploy both the VCoin token and the DEX contract.

## Contract Interaction

After deployment, you can interact with the contracts:

1. The owner can provide liquidity by calling `provideLiquidity(uint256 numTokens)`
2. Users can purchase tokens by calling `buy(uint256 numTokens)` with the appropriate ETH value
3. The owner can withdraw ETH from the contract using `withdraw(uint256 amount)`

## Project Structure

- `contracts/` - Smart contract source code
  - `VCoin.sol` - ERC20 token implementation
  - `Dex.sol` - DEX implementation
- `test/` - Test files for the contracts
- `ignition/modules/` - Hardhat Ignition deployment modules

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
