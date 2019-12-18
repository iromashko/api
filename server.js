// require("./config/seed_db")();
require("dotenv").config({ path: "./config/config.env" });
require("./config/db")();
const express = require("express");
const app = express();
app.use(express.json());

app.use("/api/v1/bootcamps", require("./routes/bootcamp"));
app.use("/api/v1/courses", require("./routes/courses"));
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
process.on("unhandledRejection", (err, promise) => {
  console.log(err);
  server.close(() => process.exit(1));
});
