import express from "express";
const app = express();
import { getBootcamp } from "./controllers/bootcamp";

app.get("/", getBootcamp);

app.listen(5000, () => {
  console.log(`server started`);
});