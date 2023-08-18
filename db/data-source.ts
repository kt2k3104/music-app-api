import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from 'dotenv'

config()

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.DATABASE_TYPE as 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [process.env.DATABASE_TYPEORM_ENTITIES_PATH],
  migrations: [process.env.DATABASE_TYPEORM_MIGRATIONS_PATH],
  synchronize: false
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource
