require("dotenv").config(); //to get resources from .env file

// express
const express = require("express");
const app = express();

//rest of packages importations
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const cors = require("cors");
const cloudniary = require("cloudinary").v2;

//database
const connectDB = require("./db/connectDB");

//routes importations
const authRoute = require("./route/authRoute");
const userRoute = require("./route/userRoute");
const nationalOfficialsRoute = require("./route/nationalOfficialsRoute");
const setRoute = require("./route/setRoute");
const galleryRoute = require("./route/galleryRoute");
//middlewares importations
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
//middlewares initialization
app.use(morgan("tiny")); //to see the hit route in the console
app.use(express.json()); // to get json form of res
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload({ useTempFiles: true }));
cloudniary.config({
  cloud_name: process.env.CLOUTINARY_CLOUD_NAME,
  api_key: process.env.CLOUTINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUTINARY_CLOUD_API_SECRET,
});
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend port
    credentials: true, // Allows cookies to be sent with requests
  })
);

//route initialization
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/national-officials", nationalOfficialsRoute);
app.use("/api/nosa-sets", setRoute);
app.use("/api/gallery", galleryRoute);
//errors initialization
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
//starting the app
const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => console.log(`Server is running on port ${port}...`));
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
start();
// 7091385034; wema data site
// 08079353851
