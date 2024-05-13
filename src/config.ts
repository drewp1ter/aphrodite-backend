import { config as dotenvConfig } from 'dotenv'
if (process.env.NODE_ENV !== 'test') dotenvConfig()

const defaultConfig = {
  debug: false,
  defaultPageSize: 100,
  jwt: {
    secret: 'changeme',
    expiresIn: '1d'
  },
  admin: {
    email: 'dev@dev.io',
    password: 'dev',
    phone: '+79990000000'
  },
  db: {
    user: 'root',
    name: 'aphrodite_dev',
    password: '',
    host: 'localhost',
    port: 3306
  },
  iiko: {
    apiLogin: '',
    organizationId: '',
    categoryMarker: '#'
  },
  telegram: {
    token: '',
    chatId: ''
  },
  yookassa: {
    shopId: '',
    secretKey: ''
  },
  thankYouPage: 'http://localhost:3001/thankyou'
}

export const config = assignDefined(defaultConfig, {
  debug: process.env.DEBUG && 'true' === process.env.DEBUG,
  jwt: assignDefined(defaultConfig.jwt, {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  }),
  admin: assignDefined(defaultConfig.admin, {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    phone: process.env.ADMIN_PHONE
  }),
  db: assignDefined(defaultConfig.db, {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT)
  }),
  iiko: assignDefined(defaultConfig.iiko, {
    apiLogin: process.env.IIKO_API_LOGIN,
    organizationId: process.env.IIKO_ORGANIZATION_ID,
    categoryMarker: process.env.IIKO_CATEGORY_MARKER
  }),
  telegram: assignDefined(defaultConfig.telegram, {
    token: process.env.TELEGRAM_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID
  }),
  yookassa: assignDefined(defaultConfig.yookassa, {
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY
  }),
  thankYouPage: process.env.THANK_YOU_PAGE
})

function assignDefined(target, ...sources) {
  for (const source of sources) {
    for (const key in source) {
      if (undefined === source[key]) continue
      target[key] = source[key]
    }
  }
  return target
}
