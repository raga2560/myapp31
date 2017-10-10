'use strict';

module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev',
  debug: true,
  logging: {
    format: 'tiny'
  },
  //  aggregate: 'whatever that is not false, because boolean false value turns aggregation off', //false
  aggregate: false,
  mongoose: {
    debug: false
  },
  hostname: 'http://localhost:3000',
  app: {
    name: 'MEAN - A Modern Stack - Development'
  },
  strategies: {
      local: {
        enabled: true
      },
      facebook: {
        clientID: 'DEFAULT_APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
        enabled: false
      },
      twitter: {
        clientID: 'DEFAULT_CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:3000/api/auth/twitter/callback',
        enabled: false
      },
      github: {
        clientID: 'DEFAULT_APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:3000/api/auth/github/callback',
        enabled: false
      },
      google: {
          clientID: '970185861626-ss3ddnn16opd4mj07lg65o8ls43va110.apps.googleusercontent.com',
        clientSecret: 'cwEOfKJJ7Yg2neoAWVQ5isDe',
        callbackURL: 'http://localhost:3000/api/auth/google/callback',
        enabled: true
      },
      linkedin: {
        clientID: 'DEFAULT_API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:3000/api/auth/linkedin/callback',
        enabled: false
      }
  },
  emailFrom: 'SENDER EMAIL ADDRESS', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'SES', // Gmail, SMTP
    auth: {
      user: 'raga2560@gmail.com',
      pass: 'obama4india'
    }
  }, 
  secret: 'SOME_TOKEN_SECRET'
};