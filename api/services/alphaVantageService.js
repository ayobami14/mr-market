const rp = require('request-promise');
const _ = require('lodash');
const Promise = require('bluebird');

const URI = 'https://www.alphavantage.co/query';
const API_KEY = 'MHR0YP2GC53ONW72';

const TIME_SERIES_DAILY_KEY = 'Time Series (Daily)';

function getStockDataRaw(stockSymbol = 'MFST') {
	console.log('AlphaVantage: getStockDataRaw');
	const options = {
		uri: URI,
		qs: {
			function: 'TIME_SERIES_DAILY',
			symbol: stockSymbol,
			apikey: API_KEY
		},
		json: true // Automatically parses the JSON string in the response
	};

	return rp(options)
		.then(stockData => {
			// console.log(stockData);
			return stockData;
		})
		.catch(err => {
			console.log(err);
		});
}

function getStockData(stockSymbol = 'MFST') {
	return getStockDataRaw(stockSymbol)
		.then(stockData => {
			const timeSeriesDaily = stockData[TIME_SERIES_DAILY_KEY];
			return Promise.all(_.map(timeSeriesDaily, timeSeries => {
				/*
				 { '2017-07-11 15:29:00':
					  { '1. open': '0.0020',
						 '2. high': '0.0021',
						 '3. low': '0.0019',
						 '4. close': '0.0020',
						 '5. volume': '2599580' },
					}
				 */

				// Get the key, which is the date.
				let dates = Object.keys(timeSeries);
				let date = dates[0];

				let dayData = {};

				dayData.date = new Date(date).getTime();
				dayData.open = timeSeries['1. open'];
				dayData.high = timeSeries['2. high'];
				dayData.low = timeSeries['3. low'];
				dayData.close = timeSeries['4. close'];
				dayData.volume = timeSeries['5. volume'];

				return dayData;
			}));
		})
		.catch(err => {
			console.log(err);
		})
}


module.exports = {
	getStockDataRaw: getStockDataRaw,
	getStockData: getStockData
};


