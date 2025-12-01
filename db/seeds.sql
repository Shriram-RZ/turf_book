-- Insert Users
INSERT INTO users (name, email, password_hash, phone, role) VALUES
('John Doe', 'john@example.com', '$2a$10$D7.k.X.X.X.X.X.X.X.X.X', '1234567890', 'USER'),
('Jane Smith', 'jane@example.com', '$2a$10$D7.k.X.X.X.X.X.X.X.X.X', '0987654321', 'USER'),
('Turf Owner', 'owner@example.com', '$2a$10$D7.k.X.X.X.X.X.X.X.X.X', '1122334455', 'OWNER');

-- Insert Turfs
INSERT INTO turfs (owner_id, name, location, amenities, images, pricing_rules) VALUES
(3, 'Green Valley Turf', 'Downtown', '["Parking", "Water", "Changing Room"]', '["image1.jpg", "image2.jpg"]', '{"base_price": 1000, "weekend_price": 1200}');

-- Insert Slots (Example for today)
INSERT INTO turf_slots (turf_id, slot_date, start_time, end_time, is_available, custom_price) VALUES
(1, CURRENT_DATE, '18:00:00', '19:00:00', TRUE, 1000.00),
(1, CURRENT_DATE, '19:00:00', '20:00:00', TRUE, 1000.00),
(1, CURRENT_DATE, '20:00:00', '21:00:00', TRUE, 1200.00);
