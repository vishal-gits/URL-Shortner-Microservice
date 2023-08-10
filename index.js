require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const url = require("url");
const dns = require("dns");
const mongoose = require("mongoose");
const urlModel = require("./db");

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use("/public", express.static(`${process.cwd()}/public`));
// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

// Connections
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("connected");
    // const urlCount = (await urlModel.countDocuments()) + 1;
    // console.log(urlCount);
  } catch (err) {
    console.log(err);
  }
}
main();

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
app.post("/api/shorturl", (req, res) => {
  // const { url } = req.body;
  console.log(req.body.url);
  let inputUrl;
  const validUrl = (url) => {
    try {
      if (new URL(url)) {
        console.log("p1");
        if (url.startsWith("https://") || url.startsWith("http://")) {
          console.log("p2");
          return true;
        } else {
          res.status(200).json({ error: "invalid url" });
        }
      }

      // if (new URL(url)
      //   (url.startsWith("https://") || url.startsWith("http://"))
      // ) {
      //   return true;
      // }
      // new URL(url);
      // return true;
    } catch (err) {
      res.status(200).json({ error: "invalid url" });
      return false;
    }
  };

  if (validUrl(req.body.url)) {
    inputUrl = req.body.url;
    console.log("inputUrl=", inputUrl);
    let urlPair;
    let urlCount;
    const dbUpdate = async () => {
      urlPair = await urlModel.findOne({ original_url: inputUrl });
      if (!urlPair) {
        console.log("update records");
        urlCount = (await urlModel.countDocuments()) + 1;
        console.log(urlCount);
        urlPair = await urlModel.create({
          original_url: inputUrl,
          short_url: urlCount,
        });
      }

      console.log(urlPair);
      res.status(200).json({
        original_url: urlPair.original_url,
        short_url: urlPair.short_url,
      });
    };
    dbUpdate();
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(id, typeof id);
  const findId = async () => {
    try {
      const urlPair = await urlModel.findOne({ short_url: id });
      console.log(urlPair);
      res.redirect(urlPair.original_url);
    } catch (err) {
      res.status(400).json({ error: "Could not fetch data" });
    }
  };
  findId();
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
