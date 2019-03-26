module.exports = {
  port: process.env.PORT || 5001,
  token: process.env.TOKEN,
  mongoURI: process.env.MONGO_URI,
  urlLetter: process.env.URL_LETTER,
  urlAjax: process.env.URL_AJAX,
  cronSchedule: process.env.CRON_SCHEDULE || "0 1 * * *",
  cronScheduleSubDays: process.env.CRON_SCHEDULE_SubDays || "0 1 * * *",
  logLevel: process.env.LOG_LEVEL || "info"
};
