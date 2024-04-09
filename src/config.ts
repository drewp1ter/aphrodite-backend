const defaultConfig = {
  debug: false,
  defaultPageSize: 30,
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
