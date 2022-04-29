// boilerplate below the cut
//#region
/// importing the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;
const Schema = mongoose.Schema;
require("dotenv").config();

mongoose.connect(
  process.env.MONGO_STRING || "add your connection string here",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to Mongo Database");
  }
);

const multer = require("multer");
const storage = multer.memoryStorage();
const fs = require("fs");

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

app.use(express.static("./uploads"));

app.get("/", (req, res) => {
  return res.json({ message: "Hello world 🔥🇵🇹" });
});
//#endregion

// Define image shcema to pass into db
const Image = mongoose.model(
  "Image",
  (ImageSchema = new Schema({
    imageId: {
      type: ObjectId,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    // This is the hot tamale vvv
    image: {
      type: Buffer, // casted to MongoDB's BSON type: binData
      required: true,
    },
  }))
);

// util function that just grabs testUpload from file directory, will be replaced when image comes from frontend
const imageData = {
  imageId: ObjectId(),
  username: "DemoUserProflePic",
  image: fs.readFileSync(`testUpload.jpg`),
};

app.post("/imagepush", (req, res) => {
  // new Image obj
  const image = new Image(imageData);
  image
    // save into db
    .save()
    .then(() => console.log("Image Saved Successfully!"))
    .then(() =>
      mongoose.connection.close(() =>
        console.log("Connection Closed successfully!")
      )
    )
    .catch((err) => console.log(`Error in Saving Image: ${err}`));
  // for now we just pass Image back to frontned
  res.send(image);
});

// starting the server
app.listen(port, () => {
  console.log(`listening on  ${port}`);
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("Server connected!");
});
