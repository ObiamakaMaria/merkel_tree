const crypto = require("crypto");

// Function to hash an address
function hashAddress(address) {
    return crypto.createHash("sha256").update(address).digest("hex");
}

// Function to compute Merkle Root
function computeMerkleRoot(hashes) {
    if (hashes.length === 1) return hashes[0];

    let newLevel = [];
    for (let i = 0; i < hashes.length; i += 2) {
        if (i + 1 < hashes.length) {
            newLevel.push(hashAddress(hashes[i] + hashes[i + 1]));
        } else {
            // If odd number, carry last hash to next level
            newLevel.push(hashes[i]);
        }
    }

    return computeMerkleRoot(newLevel);
}

// Function to generate Merkle Proof
function generateProof(hashes, targetHash) {
    let proof = [];
    let index = hashes.indexOf(targetHash);
    while (hashes.length > 1) {
        let newLevel = [];
        for (let i = 0; i < hashes.length; i += 2) {
            let pairHash = null;
            if (i + 1 < hashes.length) {
                pairHash = hashes[i + 1];
                newLevel.push(hashAddress(hashes[i] + pairHash));
            } else {
                newLevel.push(hashes[i]);
            }

            if (hashes[i] === targetHash) {
                proof.push(pairHash);
            } else if (i + 1 < hashes.length && hashes[i + 1] === targetHash) {
                proof.push(hashes[i]);
            }
        }

        hashes = newLevel;
        targetHash = hashAddress(targetHash);
    }

    return proof;
}

// Function to verify Merkle Proof
function verifyProof(proof, targetHash, merkleRoot) {
    let currentHash = targetHash;

    for (let hash of proof) {
        if (!hash) continue;
        currentHash = hashAddress(currentHash + hash);
    }

    return currentHash === merkleRoot;
}

// Sample addresses
const addresses = [
    "0xAbcd1234...",
    "0xEfgh5678...",
    "0xIjkl9101...",
    "0xMnop1121...",
    "0xQrstu3141..."
];

// Hash each address
const hashedAddresses = addresses.map(hashAddress);

// Compute Merkle Root
const merkleRoot = computeMerkleRoot(hashedAddresses);
console.log("Merkle Root:", merkleRoot);

// Choose an address to verify
const targetAddress = hashAddress("0xEfgh5678...");
const proofPath = generateProof([...hashedAddresses], targetAddress);

// Verify Merkle Proof
const isValid = verifyProof(proofPath, targetAddress, merkleRoot);
console.log("Verification:", isValid);

