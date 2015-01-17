var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.json([
      {id: "allObjects" , name: "All objects"},
      {id: 1, name: "FirstGroup"},
      {id: 2 , name: "SecondGroup"},
      {id: "notInGroup" , name: "Not in group"}
    ]);
});

module.exports = router;
