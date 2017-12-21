const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 5000

app.set('port', PORT);

app.use(express.static(path.join(__dirname,"www")));

app.get("/",function(req,res){
	return res.redirect("/index.html");
})

var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});