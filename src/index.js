import "babel-polyfill";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cron from "node-cron";
import config from "./config/config";
import FakeMedRoutes from "./routes/FakeMedRoutes";
import FakeMedUtils from "./routes/FakeMedUtils";
import log from "./Logging";

import dateFormat from "date-fns/format";
import startOfYesterday from "date-fns/start_of_yesterday";
import subDays from "date-fns/sub_days";

const GetYesterday = () => dateFormat(startOfYesterday(), "DD.MM.YYYY");
const GetSubDays = () => dateFormat(subDays(new Date(), 10), "DD.MM.YYYY");
const GetNow = () => dateFormat(new Date(), "DD.MM.YYYY");

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, { useMongoClient: true }, err => {
  if (err) log.error(err);
  else {
    console.log("MongoDB connected!");

    // cron job to update fakemeds
    cron.schedule(config.cronSchedule, () => {
      log.info(`Start update FakeMeds: ${Date()}`);
      FakeMedUtils.UpdateFakeMeds(GetYesterday(), GetYesterday());
    });

    // cron job to update fakemeds sub days (10 days)
    cron.schedule(config.cronScheduleSubDays, () => {
      log.info(`Start update FakeMeds (sub days): ${Date()}`);
      FakeMedUtils.UpdateFakeMeds(GetSubDays(), GetNow());
    });
  }
});

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// routes
app.use("/api/fakemed", FakeMedRoutes);

// test route
app.get("/test", (req, res) => {
  res.status(200).send({ result: "GET: /test" });
});

app.listen(config.port, () => {
  console.log(`Server running (port: ${config.port})`);
});
