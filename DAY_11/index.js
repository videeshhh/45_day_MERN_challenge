const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const PORT = 3000;

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'resumeData';
let db;

app.use(express.json());

app.put('/api/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        const objectId = new ObjectId(projectId);
        const updateData = req.body;
        updateData.updatedAt = new Date();
        const result = await db.collection('projects').updateOne(
        { _id: objectId },
        { $set: updateData }
    );
    if (result.matchedCount === 0) {
        return res.status(404).json({
        success: false,
        error: 'Project not found'
        });
    }
        res.json({
        success: true,
        message: 'Project updated successfully',
        modifiedCount: result.modifiedCount
        });
        } catch (error) {
        res.status(500).json({
        success: false,
        error: 'Failed to update project'
    });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
    const projectId = req.params.id;
    const objectId = new ObjectId(projectId);
    const result = await db.collection('projects').deleteOne({
    _id: objectId
    });
        if (result.deletedCount === 0) {
        return res.status(404).json({
        success: false,
        error: 'Project not found'
        });
    }
        res.status(204).send();
        } catch (error) {
        res.status(500).json({
        success: false,
        error: 'Failed to delete project'
        });
    }
});

MongoClient.connect(mongoUrl).then(client => {
db = client.db(dbName);
console.log('✅ Connected to MongoDB');
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});