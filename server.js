const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Stock = require('./models/stock');
const path = require('path');
const ejs = require('ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb+srv://salmakhaled963:qINU1gHPYtwY96wv@cluster0.ov32zdp.mongodb.net/test')
.then(() => {
  console.log('Database connected successfully');
})
.catch((err) => {
  console.error('Error connecting to the database', err);
});


const API_URL = 'https://api.iex.cloud/v1/data/CORE/STOCK_COLLECTION/list';
const API_GAINERS = 'collectionName=gainers&';
const API_LOSERS = 'collectionName=losers&';
const API_KEY = 'pk_351875bcf04542c8acf7bab4fd4b0eed';



app.get('/tickers', async(req, res)=>{
  try{
     const response = await fetch(`${API_URL}?${API_GAINERS}token=${API_KEY}`);
     const data = await response.json();
     console.log(data);
     res.json(data);
  }catch(error){
    console.log(error);
  }
});

app.get('/home', (req, res) => {
  res.sendFile('home.html', { root: __dirname + '/public' });
});

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});