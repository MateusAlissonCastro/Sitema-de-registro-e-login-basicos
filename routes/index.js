var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Seja bem-vindo ao meu site');
});

module.exports = router;
