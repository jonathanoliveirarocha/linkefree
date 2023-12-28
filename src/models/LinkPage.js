const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linkPageSchema = new mongoose.Schema({
  instagram: String,
  youtube: String,
  whatsapp: String,
  facebook: String,
  tiktok: String,
  linkedin: String,
  twitter: String,
  vsco: String,
  kwai: String,
  pinterest: String,
  site: String,
  link: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const LinkPage = mongoose.model("LinkPage", linkPageSchema);

module.exports = LinkPage;
