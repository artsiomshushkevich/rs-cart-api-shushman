import { Pool } from 'pg';

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.on('error', err => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const getPoolClient = async () => {
    const client = await pool.connect();
    return client;
};
