const bcrypt = require('bcryptjs');

async function generateHash() {
    const hash = await bcrypt.hash('Admin123', 10);
    console.log(hash);
}

generateHash();