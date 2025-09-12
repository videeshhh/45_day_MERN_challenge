const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = 3000;

const mongoUrl = 'mogo_url';
const dbName = 'resumeData';
let db;

async function connectToMongoDB() {
const client = new MongoClient(mongoUrl);
try {

await client.connect();

console.log(' Connected successfully to MongoDB');

db = client.db(dbName);
console.log(`Using database: ${dbName}`);

await db.admin().ping();
console.log(' Database ping successful');
return db;
} catch (error) {
console.error(' MongoDB connection error:', error.message);
throw error;
}
}

app.use(express.json());

app.get('/api/status', (req, res) => {
res.json({
message: 'MongoDB connection successful!',
database: dbName,
status: 'connected',
timestamp: new Date().toISOString()
});
});

connectToMongoDB().then(() => {
app.listen(PORT, () => {
console.log(` Server running on http://localhost:${PORT}`);
console.log(` Test your connection: http://localhost:${PORT}/api/status`);
});
}).catch(error => {
console.error(' Failed to start server:', error.message);
process.exit(1);
});