var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.json([
      {id: 1 , name: "First" , coord: { lat: 55.716011, lng: 37.553126 } , image: "markerA" , groups:[1,3]},
      {id: 2 , name: "Second", coord: { lat: 55.770638, lng: 37.680894 } , image: "markerB"},
      {id: 3 , name: "Third", coord: { lat: 55.768025, lng: 37.629224} , image: "markerC" , groups:[1,2]},
      {id: 4 , name: "Fourth", coord: { lat: 55.802327, lng: 37.565887} , image: "markerD" , groups:[2,3]},
      {id: 5 , name: "Fifth", coord: { lat: 55.736524, lng: 37.508895} , image: "markerE"},
    ]);
});

module.exports = router;
