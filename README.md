CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL
);

CREATE TABLE restaurants (
  restaurant_id SERIAL PRIMARY KEY,
  restaurant_name VARCHAR(255) NOT NULL
);

CREATE TABLE reservations (
  reservation_id SERIAL PRIMARY KEY,
  reservation_date DATE NOT NULL,
  party_count INTEGER NOT NULL,
  restaurant_id INTEGER REFERENCES restaurants(restaurant_id),
  customer_id INTEGER REFERENCES customers(customer_id)
);

INSERT INTO customers (customer_name) VALUES 
('Lisa Chang'), 
('Adolfo Herbert'), 
('Gene Rue'), 
('Jane Goodall'), 
('Robert Yile'), 
('Harriette Smith'), 
('Lane Jacobi'), 
('River Padio'), 
('Ellis Pickard'), 
('Chad Warrent'), 
('Taylor Webber'), 
('Dean Max'), 
('Elizabeth Zeale')
RETURNING *;

INSERT INTO restaurants (restaurant_name) VALUES 
('RomAntica Italian'),
('Le Artiose'),
('Kokkari'),
('Palio')
RETURNING *;

INSERT INTO reservations (restaurant_id, customer_id, reservation_date, party_count) VALUES 
(1, 1, '2025-05-01', 4),
(2, 2, '2025-05-02', 2),
(3, 3, '2025-05-03', 6),
(4, 4, '2025-05-04', 3),
(1, 5, '2025-05-05', 2),
(2, 6, '2025-05-06', 5),
(3, 7, '2025-05-07', 4),
(4, 8, '2025-05-08', 2),
(1, 9, '2025-05-09', 3),
(2, 10, '2025-05-10', 4),
(3, 11, '2025-05-11', 2),
(4, 12, '2025-05-12', 5)
RETURNING *;

SELECT customer_id, customer_name FROM customers;
SELECT restaurant_id, restaurant_name FROM restaurants;
SELECT reservation_id, restaurant_id, customer_id, reservation_date, party_count FROM reservations;
DELETE FROM reservations WHERE reservation_id = 5;
