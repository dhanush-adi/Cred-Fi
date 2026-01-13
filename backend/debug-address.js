const ethers = require('ethers');
const acl = "0x2FB4341027eb1d2aD8B5D9708187df602708070d";
const kms = "0x168FDc3Ae19A5d5b03614578C58974FF30FCBe92";

function check(name, addr) {
    console.log(`Checking ${name}: ${addr}`);
    if (ethers.isAddress(addr)) {
        console.log(`${name} OK`);
    } else {
        console.log(`${name} INVALID`);
         try {
            const lower = addr.toLowerCase();
            const correct = ethers.getAddress(lower);
            console.log(`${name} Corrected: ${correct}`);
        } catch (e) {
            console.log(`${name} Failed to correct: ${e.message}`);
        }
    }
}

check('ACL', acl);
check('KMS', kms);

