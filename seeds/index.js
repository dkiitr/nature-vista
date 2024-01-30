const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose
  .connect("mongodb://127.0.0.1:27017/nature-vista")
  .then(() => console.log("Database Connected!!"))
  .catch((err) => console.log(err));

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      author: "65b16e750a823c88791efe40",
      images: [
        {
          url: "https://res.cloudinary.com/darkinvader007/image/upload/v1706457682/NatureVista/dcauxjffrvphrwrp21oj.jpg",
          filename: "NatureVista/dcauxjffrvphrwrp21oj",
        },
        {
          url: "https://res.cloudinary.com/darkinvader007/image/upload/v1706457682/NatureVista/qeapvez2mk3ysv3mgtua.jpg",
          filename: "NatureVista/qeapvez2mk3ysv3mgtua",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt culpaconsequatur optio id voluptas quos, eveniet molestiae labore illo eaque doloribus odit praesentium impedit veritatis tempore nulla dignissimos. Illum,dolorum. Lorem ipsum dolor sitamet consectetur adipisicing elit. Consectetur dicta ratione, harum totam deleniti incidunt maiores corrupti quo iure magnamfacere, accusamus, in accusantium dolor quas inventore consequatur",
      title: `${sample(descriptors)} ${sample(places)}`,
      price,
    });
    await camp.save();
  }
};
seedDB().then(() => mongoose.connection.close());
