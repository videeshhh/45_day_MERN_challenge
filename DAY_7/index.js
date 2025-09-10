const express = require('express');
const app=express();

app.use(express.json());

app.get('/', (req,res)=>{
    res.send('Hello user your server has been succesfully started in localhost');
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});