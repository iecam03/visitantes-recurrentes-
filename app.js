const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/test', {
  useNewUrlParser: true, useUnifiedTopology: true
});
mongoose.connection.on("error", function (e) { console.error(e); });


var visitorSchema = mongoose.Schema({
  name: String,
  count: Number,
});
const Visitor = mongoose.model("Visitors", visitorSchema);

app.get('/', (req, res) => {
  var name = req.query.name;
  console.log("name", name);
  Visitor.updateMany({ name: name }, { $inc: { count: 1 } }, async function (err, visit) {
    if (err)
      return console.error(err);
    console.log(visit);
    if (visit.n === 0) {
      await Visitor.create({ name: name || "Anónimo", count: 1 });
    }
    let HTML = "";
    HTML += '<table><tbody><thead>';
    HTML += '<tr><th>Id</th><th>Name</th><th>Visits</th></tr>';
    Visitor.find(function (err, visitors) {
      if (err)
        return console.log(err);
      visitors.forEach(function (vi) {
        HTML += '<tr><td>' + vi["_id"] + '</td><td>' + vi["name"] + '</td><td>' + vi["count"] + '</td></tr>';
      });
      HTML += '</thead></tbody></table>';
      res.send(HTML);
    });
  });
});


app.listen(3000, () => {
  return console.log('Listening on port 3000!');
});

