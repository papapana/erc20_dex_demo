let signer;

const TOKEN_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "initialSupply", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "allowance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "balance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "approver", type: "address" }],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "spender", type: "address" }],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const TOKEN_ADDRESS = "0xA3784d7D7d0b4753d8695E1306c4C405b0b9067D";
let tokenContract = null;

const DEX_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "_price", type: "uint256" },
      { internalType: "address", name: "_token", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "EthCouldNotBeSent", type: "error" },
  { inputs: [], name: "NotEnoughEther", type: "error" },
  { inputs: [], name: "NotEnoughTokens", type: "error" },
  { inputs: [], name: "NotRightPrice", type: "error" },
  { inputs: [], name: "OnlyOwnerCanPerformThisAction", type: "error" },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "numTokens", type: "uint256" }],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "numTokens", type: "uint256" }],
    name: "getPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "numTokens", type: "uint256" }],
    name: "provideLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const DEX_ADDRESS = "0xF780c70eB6350153fAEA8D6FDB4EeB479e585756";
let dexContract = null;

async function getAccess() {
  try {
    // Request account access if needed
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // We use BrowserProvider in ethers v6
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    // Initialize contract instances
    dexContract = new ethers.Contract(DEX_ADDRESS, DEX_ABI, signer);
    tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);

    console.log("Wallet connected");
    return true;
  } catch (error) {
    console.error("User rejected the connection request:", error);
    return false;
  }
}

async function getPrice() {
  await getAccess();
  const price = await dexContract.getPrice(1);
  document.getElementById("tokenPrice").innerText = price.toString();
  return price;
}

async function getTokenBalance() {
  await getAccess();
  const balance = await tokenContract.balanceOf(await signer.getAddress());
  document.getElementById("tokenBalance").innerText = balance.toString();
  return balance;
}

async function getAvailableTokens() {
  await getAccess();
  const balance = await tokenContract.balanceOf(DEX_ADDRESS);
  document.getElementById("tokensAvailable").innerText = balance.toString();
  return balance;
}

async function grantAccess() {
  await getAccess();
  const tokens = document.getElementById("tokenGrant").value;
  await tokenContract
    .approve(DEX_ADDRESS, tokens)
    .then(() => alert("Access granted"))
    .catch((error) => alert(error));
  await dexContract
    .provideLiquidity(tokens)
    .then(() => alert("Liquidity provided"))
    .catch((error) => alert(error));

  console.log("Access granted");
}

async function buyTokens() {
  await getAccess();
  const tokens = document.getElementById("tokensToBuy").value;
  const value = await dexContract.getPrice(tokens);
  await dexContract
    .buy(tokens, { value })
    .then(() => alert("Tokens bought"))
    .catch((error) => alert(error));

  console.log(`Bought ${tokens} tokens`);
}
