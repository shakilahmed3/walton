const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect(`${process.env.MONGO_DB_URL}`);
        console.log('Database connected');

    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

module.exports = {
    connectToDatabase,
};
