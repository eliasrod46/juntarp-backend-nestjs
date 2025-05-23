import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  NODE_ENV: string;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  JWT_SECRET: string;
}

const envsSchema = joi
  .object({
    NODE_ENV: joi.string().required(),
    PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    // DB_PASSWORD: joi.string(),
    DB_DATABASE: joi.string().required(),
    JWT_SECRET: joi.string().required(),
  })
  .unknown(true); //permite mandar mas variables de las que de vaidan aca

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  node_env: envVars.NODE_ENV,
  port: envVars.PORT,
  db_host: envVars.DB_HOST,
  db_port: envVars.DB_PORT,
  db_username: envVars.DB_USERNAME,
  db_password: envVars.DB_PASSWORD,
  db_database: envVars.DB_DATABASE,
  jwt_secret: envVars.JWT_SECRET,
};
