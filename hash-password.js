const bcrypt = require('bcrypt');

// The password you want to hash
const plainPassword = 'password';

// The 'salt rounds' determine how much time is needed to calculate a single hash.
// 10 is a good, standard default.
const saltRounds = 10;

async function generateHash() {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    console.log('--- Copy this entire hash ---');
    console.log(hashedPassword);
    console.log('-----------------------------');
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

generateHash();