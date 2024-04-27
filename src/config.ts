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
    port: 3306,
  },
  iiko: {
    apiLogin: '',
    organizationId: '',
    categoryMarker: '#'
  },
  telegram: {
    token: '',
    chatId: ''
  }
}

const { env } = process

export const config = assignDefined(defaultConfig, {
  debug: env.DEBUG && 'true' === env.DEBUG,
  jwt: assignDefined(defaultConfig.jwt, {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN
  }),
  admin: assignDefined(defaultConfig.admin, {
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
    phone: env.ADMIN_PHONE
  }),
  db: assignDefined(defaultConfig.db, {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    name: env.DB_NAME,
    host: env.DB_HOST,
    port: Number(env.DB_PORT)
  }),
  iiko: assignDefined(defaultConfig.iiko, {
    apiLogin: env.IIKO_API_LOGIN,
    organizationId: env.IIKO_ORGANIZATION_ID,
    categoryMarker: env.IIKO_CATEGORY_MARKER
  }),
  telegram: assignDefined(defaultConfig.telegram, {
    token: env.TELEGRAM_TOKEN,
    chatId: env.TELEGRAM_CHAT_ID
  })
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
