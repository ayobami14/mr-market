const express = require('express');
const router = express.Router();
const AlphaVantageService = require('../services/alphaVantageService');

/* GET home page. */
router.get('/', function(req, res, next) {
  AlphaVantageService.getStockData()
    .then(data => {
      console.log(data);
      res.render('index', { title: 'Express', content: ''});
    })
    .catch(err => {
      console.log(err);
    });

});

module.exports = router;
