const express = require("express");
const {
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation,
} = require("./db");

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json
createTables(); // Ensure tables are created on server start

// Home route
app.get("/", (req, res) => {
  res.send("Reservation Planner");
});

// GET route for fetching customers
app.get("/api/customers", async (req, res) => {
  const customers = await fetchCustomers();
  res.json(customers);
});

// GET route for fetching restaurants
app.get("/api/restaurants", async (req, res) => {
  const restaurants = await fetchRestaurants();
  res.json(restaurants);
});

// POST route to create a reservation
app.post("/api/customers/:customer_id/reservations", async (req, res) => {
  const { customer_id } = req.params;
  const { restaurant_id, reservation_date, party_count } = req.body;

  try {
    const reservation = await createReservation(
      restaurant_id,
      customer_id,
      reservation_date,
      party_count
    );
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE route to delete a reservation
app.delete("/api/customers/:customer_id/reservations/:reservation_id", async (req, res) => {
  const { customer_id, reservation_id } = req.params;
  try {
    await destroyReservation(reservation_id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server listen
app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
});
