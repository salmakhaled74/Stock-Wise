const express = require('express');
const app = express();


const API_KEY = 'a08030255b71b0e00bf7fcba2d9234d8';

app.get('/tickers', async(req, res)=>{
  try{
     const response = await fetch(`http://api.marketstack.com/v1/tickers?access_key=${API_KEY}&limit=5&sort=asc`);
     const data = await response.json();
     console.log(data);
     res.json(data);
  }catch(error){
    console.log(error);
  }
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});