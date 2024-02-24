const {
  NODE_ENV,
  HOST,
  PORT,
  DATABASE_URL,
  DATABASE,
  USER,
  PASSWORD,
  DB_HOST,
  DB_PORT,
} = process.env;

if (
  NODE_ENV === undefined ||
  HOST === undefined ||
  PORT === undefined ||
  DATABASE_URL === undefined ||
  DATABASE === undefined ||
  USER === undefined ||
  PASSWORD === undefined ||
  DB_HOST === undefined ||
  DB_PORT === undefined
) {
  throw new Error("Environment variables missing");
}

const env = {
  NODE_ENV,
  HOST,
  PORT,
  DATABASE_URL,
  DATABASE,
  USER,
  PASSWORD,
  DB_HOST,
  DB_PORT,
};

export default env;
