# Order Management API

A RESTful API built with **Node.js**, **Express**, and **MongoDB** for managing customers and orders.

Interactive API documentation is available via **Swagger UI** at `http://localhost:3000/api-docs`.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally on port `27017`

---

## Setup & Running

```bash
# Install dependencies
npm install

# Start the server
node .\\index.js
```

The server starts on **http://localhost:3000** by default.  
Swagger UI is available at **http://localhost:3000/api-docs**.

---

## API Endpoints

### Customers

#### `POST /customers` — Create a customer

**Request body:**
```json
{
  "name": "Ali",
  "email": "ali@example.com"
}
```

**Response `201`:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Ali",
  "email": "ali@example.com"
}
```

---

### Orders

#### `POST /orders` — Create an order

**Request body:**
```json
{
  "customerId": "507f1f77bcf86cd799439011",
  "items": ["Product 1", "Product 2"],
  "totalAmount": 99.99
}
```

**Response `201`:**
```json
{
  "_id": "60d5ec49f1a2c8b1f8e4e1a1",
  "customerId": "507f1f77bcf86cd799439011",
  "items": ["Product 1", "Product 2"],
  "totalAmount": 99.99,
  "status": "Pending"
}
```

---

#### `GET /orders` — Get all orders

**Response `200`:** Array of all orders.

---

#### `PUT /orders/:id/payment` — Submit payment for an order

**Request body:**
```json
{
  "paymentMethod": "Credit Card"
}
```

**Response `200`:** Updated order with `status: "Paid"`.  
**Response `404`:** Order not found.

---

#### `PATCH /orders/:id/cancel` — Cancel an order

**Response `200`:** Updated order with `status: "Cancelled"`.  
**Response `404`:** Order not found.

---

#### `DELETE /orders/:id` — Delete an order

**Response `200`:**
```json
{ "message": "Order deleted" }
```
**Response `404`:** Order not found.

---

## Project Structure

```
├── index.js          # App entry point, Express & Swagger setup
├── models/
│   ├── customer.js   # Customer Mongoose schema
│   └── order.js      # Order Mongoose schema
├── routes/
│   └── orders.js     # All route handlers with Swagger JSDoc
└── package.json
```
