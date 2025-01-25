// Importing the necessary library
const crypto = require("crypto");
const { MerkleTree } = require("merkletreejs");


const sha256 = (data) => crypto.createHash("sha256").update(data).digest();

// Example addresses (leaf nodes)
const addresses = [
  "0x1234567890abcdef1234567890abcdef12345678",
  "0xabcdef1234567890abcdef1234567890abcdef12",
  "0x7890abcdef1234567890abcdef1234567890abcd",
  "0x4567890abcdef1234567890abcdef1234567890a",
  "0x90abcdef1234567890abcdef1234567890abcdef",
];

// Hash all the addresses (leaves of the Merkle tree)
const leaves = addresses.map((addr) => sha256(addr));

// Create the Merkle tree using the hashed leaves
const merkleTree = new MerkleTree(leaves, sha256, { sortPairs: true });

// Get the Merkle root
const root = merkleTree.getRoot().toString("hex");
console.log("Merkle Root:", root);

// Choose an address to verify
const targetAddress = addresses[2];
const targetHash = sha256(targetAddress);

// Get the proof for the target leaf
const proof = merkleTree.getProof(targetHash);

// Verify the proof
const isValid = merkleTree.verify(proof, targetHash, root);

console.log(`Verification for ${targetAddress}:`, isValid ? "Valid" : "Invalid");
