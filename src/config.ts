import { config as dotenvConfig } from 'dotenv'
if (process.env.NODE_ENV !== 'test') dotenvConfig()

const defaultConfig = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
  appLogDirectory: '.',
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
    categoryMarker: '#',
    updateToken: ''
  },
  telegram: {
    token: '',
    chatId: ''
  },
  yookassa: {
    shopId: '',
    secretKey: ''
  },
  workingHours: {
    start: '9:00',
    end: '22:00'
  },
  thankYouPagePaymentCash: 'http://localhost:3001/thankyou',
  thankYouPagePaymentOnline: 'http://localhost:3001/thankyou'
}

export const config = assignDefined(defaultConfig, {
  appLogDirectory: process.env.APP_LOG_DIRECTORY,
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
    categoryMarker: process.env.IIKO_CATEGORY_MARKER,
    updateToken: process.env.IIKO_UPDATE_TOKEN
  }),
  telegram: assignDefined(defaultConfig.telegram, {
    token: process.env.TELEGRAM_TOKEN,
    chatIdForOrderCreated: process.env.TELEGRAM_CHAT_ID_FOR_ORDER_CREATED,
    chatIdForOrderConfirmed: process.env.TELEGRAM_CHAT_ID_FOR_ORDER_CONFIRMED
  }),
  yookassa: assignDefined(defaultConfig.yookassa, {
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY
  }),
  workingHours: {
    start: process.env.WORKING_HOURS_START,
    end: process.env.WORKING_HOURS_END
  },
  thankYouPagePaymentCash: process.env.THANK_YOU_PAGE_PYMENT_CASH,
  thankYouPagePaymentOnline: process.env.THANK_YOU_PAGE_PYMENT_ONLINE
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
