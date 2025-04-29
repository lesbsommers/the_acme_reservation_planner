const { Client } = require('pg');

const client = new Client({
  user: 'lhern',
  password: '',
  host: 'localhost',
  port: 5432,
  database: 'lhern',
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Create tables
const createTables = async () => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS customers (
      customer_id SERIAL PRIMARY KEY,
      customer_name VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS restaurants (
      restaurant_id SERIAL PRIMARY KEY,
      restaurant_name VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reservations (
      reservation_id SERIAL PRIMARY KEY,
      reservation_date DATE NOT NULL,
      party_count INTEGER NOT NULL,
      restaurant_id INTEGER REFERENCES restaurants(restaurant_id),
      customer_id INTEGER REFERENCES customers(customer_id)
    );
  `);
};

// Create customer
const createCustomer = async (customer_name) => {
  const result = await client.query(`
    INSERT INTO customers (customer_name)
    VALUES ($1)
    RETURNING *;
  `, [customer_name]);
  return result.rows[0];
};

// Create restaurant
const createRestaurant = async (restaurant_name) => {
  const result = await client.query(`
    INSERT INTO restaurants (restaurant_name)
    VALUES ($1)
    RETURNING *;
  `, [restaurant_name]);
  return result.rows[0];
};

// Create reservation
const createReservation = async (restaurant_id, customer_id, reservation_date, party_count) => {
  const result = await client.query(`
    INSERT INTO reservations (restaurant_id, customer_id, reservation_date, party_count)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `, [restaurant_id, customer_id, reservation_date, party_count]);
  return result.rows[0];
};

// Fetch customers
const fetchCustomers = async () => {
  const result = await client.query('SELECT customer_id, customer_name FROM customers;');
  return result.rows;
};

// Fetch restaurants
const fetchRestaurants = async () => {
  const result = await client.query('SELECT restaurant_id, restaurant_name FROM restaurants;');
  return result.rows;
};

// Fetch reservations
const fetchReservations = async () => {
  const result = await client.query('SELECT reservation_id, restaurant_id, customer_id, reservation_date, party_count FROM reservations;');
  return result.rows;
};

// Delete reservation
const destroyReservation = async (reservation_id) => {
  await client.query('DELETE FROM reservations WHERE reservation_id = $1;', [reservation_id]);
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReservation
};
