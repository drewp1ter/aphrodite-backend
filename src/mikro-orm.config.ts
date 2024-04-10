import { defineConfig } from '@mikro-orm/mysql'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { Migrator } from '@mikro-orm/migrations'
import { EntityGenerator } from '@mikro-orm/entity-generator'
import { SeedManager } from '@mikro-orm/seeder'
import { config } from './config'

const { db } = config

export default defineConfig({
  host: db.host,
  port: db.port,
  user: db.user,
  password: db.password,
  dbName: db.name,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: config.debug,
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  // @ts-expect-error nestjs adapter option
  registerRequestContext: false,
  extensions: [Migrator, EntityGenerator, SeedManager],
  seeder: {
    path: './src/seeder',
    pathTs: undefined,
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className
  }
})
