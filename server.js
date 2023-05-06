const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Stock = require('./models/gainers');
const path = require('path');
const ejs = require('ejs');
const gainers = require('./models/gainers');
const losers = require('./models/losers');
const StockData = require('./models/stock');

app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css');
    }
  },
}));

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
const API_URL2 = 'https://api.iex.cloud/v1/stock/';
const API_PERFORMANCE = '/chart/7d?token='


app.get('/company/:symbol', async (req, res) => {
  const name = req.params.symbol;
  try {
    const data = await StockData.find({ symbol: name }).populate('gainer loser');
    res.render('data', { data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


async function deleteAndInsertStockData() {
  try {
    // Delete all documents in the StockData collection
    await StockData.deleteMany({});
  
    // Insert stock data for all gainers and losers
    const gainerSymbols = await gainers.find({}, { _id: 0, symbol: 1 });
    const loserSymbols = await losers.find({}, { _id: 0, symbol: 1 });
  
    const symbols = [...gainerSymbols, ...loserSymbols].map(({ symbol }) => symbol);
    const promises = symbols.map(async (symbol) => {
      const response = await fetch(`${API_URL2}${symbol}${API_PERFORMANCE}${API_KEY}`);
      const data = await response.json();
      const stockData = data.map(item => ({
        symbol: symbol,
        close: item.close,
        high: item.high,
        low: item.low,
        open: item.open,
        priceDate: new Date(item.priceDate),
        volume: item.volume
      }));
  
      const gainer = await gainers.findOne({ symbol: symbol });
      const loser = await losers.findOne({ symbol: symbol });
  
      if (gainer) {
        return StockData.insertMany(stockData.map((data) => ({ ...data, gainer: gainer._id })));
      } else if (loser) {
        return StockData.insertMany(stockData.map((data) => ({ ...data, loser: loser._id })));
      } else {
        return StockData.insertMany(stockData);
      }
    });
  
    await Promise.all(promises);
  
    console.log('Stock data deleted and reinserted');
  } catch (error) {
    console.error(error);
  }
}



const saveGainersDataToDatabase = async () => {
  try {
    await gainers.deleteMany({});
    const response = await fetch(`${API_URL}?${API_GAINERS}token=${API_KEY}`);
    const data = await response.json();
    data.forEach(async (stockData) => {
      const { symbol, change, changePercent, companyName } = stockData;
      const stock = new gainers({
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
};

const saveLosersDataToDatabase = async () => {
  try {
    await losers.deleteMany({});
    const response = await fetch(`${API_URL}?${API_LOSERS}token=${API_KEY}`);
    const data = await response.json();
    data.forEach(async (stockData) => {
      const { symbol, change, changePercent, companyName } = stockData;
      const stock = new losers({
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
};

app.get('/home', async (req, res) => {
  try {
    const Gstocks = await gainers.find().sort({ changePercent: 'desc' }).limit(5);
    const Lstocks = await losers.find().sort({ changePercent: 'desc' }).limit(5);
    res.render('home', { Gstocks, Lstocks });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});


const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  // await saveGainersDataToDatabase();
  // await saveLosersDataToDatabase();
  // await deleteAndInsertStockData();

});
