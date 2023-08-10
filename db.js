const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const urlSchema = new Schema({
  original_url: String,
  short_url: Number,
});

const urlModel = new model("urlModel", urlSchema);
module.exports = urlModel;
