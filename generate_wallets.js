const rippleLib = require('ripple-lib');
const bip39 = require('bip39');
const fs = require('fs');

async function generateWallets(count) {
    const wallets = [];
    for (let i = 0; i < count; i++) {
        // Generate a 24-word mnemonic
        const mnemonic = bip39.generateMnemonic(256);
        
        // Derive a seed from the mnemonic
        const seed = await bip39.mnemonicToSeed(mnemonic);
        
        // Use the seed to generate a private key (first 32 bytes of the seed)
        const privateKey = seed.slice(0, 32);
        const privateKeyHex = privateKey.toString('hex').toUpperCase();
        
        // Use ripple-lib to derive a wallet from the private key
        const api = new rippleLib.RippleAPI();
        const keypair = api.deriveKeypair(privateKeyHex);
        const address = api.deriveAddress(keypair.publicKey);
        
        // Save wallet info
        wallets.push({
            address: address,
            publicKey: keypair.publicKey,
            privateKey: keypair.privateKey,
            mnemonic
        });
    }

    return wallets;
}

async function main() {
    const walletCount = 50; // Number of wallets to generate
    const wallets = await generateWallets(walletCount);

    // Save wallets to a file
    const outputFileName = 'xrp_wallets.json';
    fs.writeFileSync(outputFileName, JSON.stringify(wallets, null, 2));

    console.log(`Generated ${walletCount} XRP wallets and saved to ${outputFileName}`);
}

main().catch(console.error);
