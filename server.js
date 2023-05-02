const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Stock = require('./models/stock');
const path = require('path');
const ejs = require('ejs');

app.engine('ejs', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


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


const saveStockDataToDatabase1 = async () => {
  try {
    await Stock.deleteMany({});
    const response = await fetch(`${API_URL}?${API_GAINERS}token=${API_KEY}`);
    const data = await response.json();
    data.forEach(async (stockData) => {
      const { symbol, change, changePercent, companyName } = stockData;
      const stock = new Stock({
        symbol,
        change,
        changePercent,
        companyName
      });
      await stock.save();
    });
  } catch (error) {
    console.log(error);
  }
}

app.get('/home', async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ changePercent: 'desc' }).limit(5);
    res.render('home', { stocks });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 3000
app.listen(port, async() => {
  console.log(`Server listening on port ${port}`);
  //await saveStockDataToDatabase1();
});