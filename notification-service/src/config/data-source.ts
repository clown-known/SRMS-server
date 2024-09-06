import { configDotenv } from "dotenv";
import { join } from "path";
import { DataSource, DataSourceOptions } from "typeorm";

const envPath = join(process.cwd(), '.env');
configDotenv({ path: envPath });

export const postgresOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: true,
};

console.log('Postgres options:', postgresOptions);

const dataSource = new DataSource(postgresOptions);
export default dataSource;