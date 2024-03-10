const express=require('express');
const routes=require('./routes')
const app=express();
const bodyParser = require("body-parser");


app.use(express.json());

app.use('/api',routes);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(process.env.PORT || '3000',()=>{
    console.log(`Server is running on port:${process.env.PORT || '3000'}`)
});