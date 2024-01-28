const express = require("express");
const dotenv = require('dotenv');
const { mongoose } = require("mongoose");
const connectDb = require("./db");
dotenv.config();

const start = async () => {
  const app = express();
  const port = process.env.PORT || 3000;
  app.use(express.json());

  const WebinarSchema = new mongoose.Schema({
    title: String,
    teacher_name: String,
    description: String,
    teacher_img: String,
    date: String,
    time: String,
    price: String,
  });

  const Webinar = mongoose.model('Webinar', WebinarSchema);

  // Post data
  const create = async (req, res) => {
    const { title, teacher_name, description, teacher_img, date, time, price } = req.body;

    const webinar = await Webinar.create({
      title,
      teacher_name,
      description,
      teacher_img,
      date,
      time,
      price
    });

    res.json({ Webinar: webinar });
  };

  // Get all data
  const getData = async (req, res) => {
    const Webinars = await Webinar.find();
    res.json({ Webinars: Webinars });
  };

  // Find by id
  const fetchWebinar = async (req, res) => {
    const WebinarId = req.params.id;
    const Webinar = await Webinar.findById(WebinarId);
    res.json({ Webinar: Webinar });
  };

  // For delete
  const deleteData = async (req, res) => {
    const webId = req.params.id;
    // console.log(webId);
    const webinar = await Webinar.deleteOne({ _id: webId });
    //console.log(webId);
    res.json({ success: "Record deleted" });
  };

  app.post("/data", create);
  app.get("/data", getData);
  app.delete('/data/:id', deleteData);

  connectDb().then(() => {
    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  });
};

start();
