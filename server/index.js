const express = require("express");
const {
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  createReservation,
  destroyReservation,
} = require("./db");

const app = express();
const port = 3000;

app.use(express.json()); 

createTables(); // Ensure tables exist

// Home route
app.get("/", (req, res) => {
  res.send("Reservation Planner");
});

// Fetch customers
app.get("/api/customers", async (req, res) => {
  const customers = await fetchCustomers();
  res.json(customers);
});

// Fetch restaurants
app.get("/api/restaurants", async (req, res) => {
  const restaurants = await fetchRestaurants();
  res.json(restaurants);
});

// Fetch reservations
app.get("/api/reservations", async (req, res) => {
  const reservations = await fetchReservations();
  res.json(reservations);
});

// Create a reservation
app.post("/api/customers/:id/reservations", async (req, res) => {
  const { id } = req.params; // Correct param
  const { restaurant_id, reservation_date, party_count } = req.body;

  try {
    const reservation = await createReservation(
      restaurant_id,
      id, // use id instead of customer_id
      reservation_date,
      party_count
    );
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a reservation
app.delete("/api/customers/:customer_id/reservations/:id", async (req, res) => {
  const { id } = req.params; // Correct param
  try {
    await destroyReservation(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
