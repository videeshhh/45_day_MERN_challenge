const express = require("express");
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const PORT =3000;
const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'resumeData';
let db;

app.use(express.json());

app.post('/blog', async (req, res) => {
    try{
        const blogData = req.body;

        if (!blogData.title || !blogData.description){
            return res.status(400).json({
                success : false,
                error : 'Title and description are required'
            })
        }
    
    
    blogData.createdAt = new Date();
    blogData.updatedAt = new Date();

    const result = await db.collection('blogs').insertOne(blogData);
    res.status(201).json({
        success : true,
        message : 'Project successfully created',
        data : {...blogData, _id: result.insertedId}
    });

   } catch(error){
        res.status(500).json({
            success : false,
            error : 'Failed to create project'
        });
    }
});

app.get('/blog', async(req,res)=>{
    try{
        const blog = await db.collection('blogs').find({}).toArray();
        res.json({
            success :true,
            count : blog.length,
            data : blog
        });
    } catch(error){
        res.status(500).json({
            success : false,
            error : 'Failed to  blog'
        });
    }
});

app.get("/blog/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    let objectId;
    try {
      objectId = new ObjectId(blogId);
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: "Invalid blog ID",
      });
    }
    const blog = await db.collection("blogs").findOne({ _id: objectId });
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }
    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch blog",
    });
  }
});


app.put('/blog/:id' , async(req,res)=>{
    try {
        const blodId = req.params.id;
        const objectId = new ObjectId(blodId);
        const updateData = req.body;
        updateData.updatedAt = new Date();
        const result = await db.collection('blogs').updateOne(
            {_id : objectId},
            {$set : updateData}
        );
        
        if(result.matchedCount === 0){
            return res.status(404).json({
                success :false,
                error : 'Could not update your blog'
            });
        } res.json({
            success: true,
            message : 'Project upated successuflly',
            modifiedCount : result.modifiedCount
        });
    } catch(error){
        res.status(500).json({
            success :false,
            error : 'Failed to update the project'
        })
    }
});

app.delete('/blog/delete' , async(req,res)=>{
    try {
        const result = await db.collection('blogs').deleteMany({});
        res.status(200).json({
            success : true,
            message : 'Blogs have been deletd'
        });        
    } catch(error){
        res.status(500).json({
            success : false,
            error : "Failed to delete the Blogs"
        })
    }
});

app.delete('/blog/delete/:id', async(req,res)=> {
    try{
        const blodId = req.params.id;
        const objectId = new objectId(blodId);
        const result = await db.collection('blogs').deleteOne({
            _id : objectId
        });

        if (result.deletedCount===0){
            return res.status(404).json({
                success :false,
                error : 'ther are no blogs'
            });
        } res.status(204).send();
    } catch(error){
        res.status(500).json({
            success :false,
            error : 'Failed to delete the blog'
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