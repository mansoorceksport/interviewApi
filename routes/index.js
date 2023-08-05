var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("index page");
  return res.json({
    "message": "Welcome to the Interview API!"
  });
  ///res.render('index', { title: 'Express' });
});

module.exports = router;
