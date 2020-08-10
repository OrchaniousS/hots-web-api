const express = require("express");
const request = require("request");
const functions = require("firebase-functions");

const app = express();

app.set("port", process.env.PORT || 8080);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
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

    const parsed = JSON.stringify(bHTMLSPLIT);
    const parsed2 = JSON.parse(parsed);

    console.log(parsed2);
    res.set("Cache-Control", "public, max-age=300,s-maxage=600");
    res.send(parsed2);
  });
});

exports.app = functions.https.onRequest(app);

app.listen(app.get("port"));
