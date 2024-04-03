import { defineConfig } from '@mikro-orm/mysql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Migrator } from '@mikro-orm/migrations'
import { EntityGenerator } from '@mikro-orm/entity-generator'
import { SeedManager } from '@mikro-orm/seeder'

const { DB_USER = 'aphrodite', DB_PASSWORD = 'hYh8&9P5ae1h3dJLnGVrZM', DB_NAME = 'aphrodite', DB_HOST = 'localhost', DB_PORT = 3306 } = process.env

export default defineConfig({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  dbName: DB_NAME,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: true,
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  // @ts-expect-error nestjs adapter option
  registerRequestContext: false,
  extensions: [Migrator, EntityGenerator, SeedManager],
  seeder: {
    path: './database/seeder',
    pathTs: undefined,
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className
  }
})
