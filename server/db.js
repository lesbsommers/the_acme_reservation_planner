const { Client } = require('pg');
const express = require('express');

const app = express();
const port = 3000;

// Connect to Postgres
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

// Middleware to parse JSON request body
app.use(express.json());

// Function to create the tables
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

// Function to create a customer
const createCustomer = async (customer_name) => {
  const result = await client.query(`
    INSERT INTO customers (customer_name)
    VALUES ($1) 
    RETURNING *;
  `, [customer_name]);
  return result.rows[0]; // Return the created customer
};

// Function to create a restaurant
const createRestaurant = async (restaurant_name) => {
  const result = await client.query(`
    INSERT INTO restaurants (restaurant_name)
    VALUES ($1) 
    RETURNING *;
  `, [restaurant_name]);
  return result.rows[0]; // Return the created restaurant
};

// Function to create a reservation with correct customer_id
const createReservation = async (restaurant_id, customer_id, reservation_date, party_count) => {
  try {
    // Ensure the customer exists
    const customerCheck = await client.query('SELECT * FROM customers WHERE customer_id = $1', [customer_id]);
    
    if (customerCheck.rows.length === 0) {
      throw new Error(`Customer with ID ${customer_id} does not exist.`);
    }

    // If the customer exists, create the reservation
    const result = await client.query(`
      INSERT INTO reservations (restaurant_id, customer_id, reservation_date, party_count)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [restaurant_id, customer_id, reservation_date, party_count]);

    return result.rows[0]; // Return the created reservation
  } catch (err) {
    console.error('Error creating reservation:', err);
    throw err; // Rethrow error to be handled in the route
  }
};

// Function to fetch all customers
const fetchCustomers = async () => {
  const result = await client.query('SELECT customer_id, customer_name FROM customers;');
  return result.rows;
};

// Function to fetch all restaurants
const fetchRestaurants = async () => {
  const result = await client.query('SELECT restaurant_id, restaurant_name FROM restaurants;');
  return result.rows;
};

// Function to delete a reservation
const destroyReservation = async (reservation_id) => {
  await client.query('DELETE FROM reservations WHERE reservation_id = $1;', [reservation_id]);
};

module.exports = {
  client,
  createTables,
  createCustomer,  // Exporting createCustomer to use in index.js
  createRestaurant, // Exporting createRestaurant to use in index.js
  fetchCustomers,   // Exporting fetchCustomers to use in index.js
  fetchRestaurants, // Exporting fetchRestaurants to use in index.js
  createReservation, // Exporting createReservation to use in index.js
  destroyReservation // Exporting destroyReservation to use in index.js
};
