const dbConfig = {
    HOST: 'roundhouse.proxy.rlwy.net',
    USER: 'root',
    PASSWORD: 'VhYPSDKjjnuKOwmqkGxhUTmKfPpubsRU',
    DB: 'railway',
    PORT: 28425,
    dialect: 'mysql',
    timezone: '+07:00',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

export default dbConfig;
