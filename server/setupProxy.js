const express = require("express");
const request = require("request");
// const functions = require("firebase-functions");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.set("port", process.env.PORT || 8080);
app.use(cors());
app.use(bodyParser.json());
app.use("weekly", function (req, res, next) {
  next();
});

app.get("/weekly", (req, res) => {
  const bHTMLSPLIT = [];
  request("https://heroesofthestorm.com/en-us/", (error, response, body) => {
    console.error("error:", error);
    console.log("statusCode:", response && response.statusCode);

    const bodyHTML = JSON.stringify(body).toString();
    const bodyHTMLSplit = bodyHTML
      .split("<section")[6]
      .split(`<h2 class=\\"hero__title\\">`);

    for (let i = 1; i < bodyHTMLSplit.length; i++) {
      const splittedHero = bodyHTMLSplit[i].split("</h2>", 1)[0];
      bHTMLSPLIT.push({ heroName: splittedHero });
    }

    const parsed = JSON.parse(JSON.stringify(bHTMLSPLIT));

    console.log(parsed);
    res.send(parsed);
    res.set("Cache-Control", "public, max-age=300,s-maxage=600");
  });
});

// exports.app = functions.https.onRequest(app);

app.listen(app.get("port"));
