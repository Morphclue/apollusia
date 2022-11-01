export const environment = {
    port: +process.env.PORT || 3000,
    mongo: {
        uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nest',
    },
};
