require("dotenv").config({ path: "./config/config.env" });
require("./config/db")();
const express = require("express");
const app = express();

// require("./config/seed_db")();

app.use(express.json());

app.use("/api/v1/bootcamps", require("./routes/bootcamp"));
app.use("/api/v1/courses", require("./routes/courses"));
app.use(require("./middleware/errorHandler"));

if (process.env.NODE_ENV === "development") {
  app.use(require("morgan")("dev"));
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
process.on("unhandledRejection", (err, promise) => {
  console.log(err);
  server.close(() => process.exit(1));
});
