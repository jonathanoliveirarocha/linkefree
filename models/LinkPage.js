const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const linkPageSchema = new mongoose.Schema({
  instagram: {
    type: String,
  },
  youtube: {
    type: String,
  },
  whatsapp: {
    type: String,
  },
  facebook: {
    type: String,
  },
  tiktok: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  twitter: {
    type: String,
  },
  vsco: {
    type: String,
  },
  kwai: {
    type: String,
  },
  pinterest: {
    type: String,
  },
  site: {
    type: String,
  },
  link: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const LinkPage = mongoose.model("LinkPage", linkPageSchema);

module.exports = LinkPage;
