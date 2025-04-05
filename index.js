const express = require("express");
const app = express();
const connectDB = require("./Utils/db");
const userRouter = require("./Routes/userRoutes");
const projectRouter = require("./Routes/projectRoutes");
const port = 3000;

app.use(express.json());

//Connection to DB
connectDB();

//User Routes
app.use("/", userRouter);
app.use("/", projectRouter);

//Start the Server
app.get("/", (req, res) => {
  res.send("Welcome.....");
});

//Listen
app.listen(port, () => {
  console.log("App is listening on ", port);
});
