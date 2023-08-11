export const environment = {
  port: +process.env.PORT || 3000,
  origin: process.env.ORIGIN || 'http://localhost:4200',
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nest',
  },
  assetPath: __dirname + '/assets/',
  polls: {
    activeDays: +process.env.ACTIVE_DAYS || 7, // how many days a poll is active after the deadline is reached
  }
};
