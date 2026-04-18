const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Order = require('../models/order');

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     parameters:
 *       - in: body
 *         name: customer
 *         description: Customer to create
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Customer'
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         schema:
 *           $ref: '#/definitions/Customer'
 *         examples:
 *           application/json:
 *             _id: "507f1f77bcf86cd799439011"
 *             name: "Ali Iranmanesh"
 *             email: "ali@example.com"
 *             __v: 0
 *       400:
 *         description: Validation error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *         examples:
 *           application/json:
 *             message: "Customer validation failed: name: Path `name` is required."
 */

// Create Customer
router.post('/customers', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    console.log('Customer', req.body.name, 'created');
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     parameters:
 *       - in: body
 *         name: order
 *         description: Order to create
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         schema:
 *           $ref: '#/definitions/Order'
 *         examples:
 *           application/json:
 *             _id: "60d5ec49f1a2c8b1f8e4e1a1"
 *             customerId: "507f1f77bcf86cd799439011"
 *             items: ["Product 1", "Product 2"]
 *             totalAmount: 99.99
 *             status: "Pending"
 *             __v: 0
 *       400:
 *         description: Validation error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *         examples:
 *           application/json:
 *             message: "Order validation failed: customerId: Path `customerId` is required."
 */

// Create Order
router.post('/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    console.log('Order created for customer', req.body.customerId);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Returns all orders
 *     responses:
 *       200:
 *         description: List of all orders
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Order'
 *         examples:
 *           application/json:
 *             - _id: "60d5ec49f1a2c8b1f8e4e1a1"
 *               customerId: "507f1f77bcf86cd799439011"
 *               items: ["Product 1", "Product 2"]
 *               totalAmount: 99.99
 *               status: "Pending"
 *               __v: 0
 */

// Get all Orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    console.log('GET /orders request received');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /orders/{id}/payment:
 *   put:
 *     summary: Submit payment for an order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the order
 *       - in: body
 *         name: payment
 *         description: Payment details
 *         required: true
 *         schema:
 *           $ref: '#/definitions/PaymentBody'
 *     responses:
 *       200:
 *         description: Payment submitted — order status updated to Paid
 *         schema:
 *           $ref: '#/definitions/Order'
 *         examples:
 *           application/json:
 *             _id: "60d5ec49f1a2c8b1f8e4e1a1"
 *             customerId: "507f1f77bcf86cd799439011"
 *             items: ["Product 1", "Product 2"]
 *             totalAmount: 99.99
 *             status: "Paid"
 *             paymentMethod: "Credit Card"
 *             __v: 0
 *       404:
 *         description: Order not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *         examples:
 *           application/json:
 *             message: "Order not found"
 */

// Submit Payment
router.put('/orders/:id/payment', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentMethod: req.body.paymentMethod, status: 'Paid' },
      { new: true, runValidators: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    console.log('Payment submitted for order', req.params.id);
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: Order cancelled — status updated to Cancelled
 *         schema:
 *           $ref: '#/definitions/Order'
 *         examples:
 *           application/json:
 *             _id: "60d5ec49f1a2c8b1f8e4e1a1"
 *             customerId: "507f1f77bcf86cd799439011"
 *             items: ["Product 1", "Product 2"]
 *             totalAmount: 99.99
 *             status: "Cancelled"
 *             __v: 0
 *       404:
 *         description: Order not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *         examples:
 *           application/json:
 *             message: "Order not found"
 */

// Cancel Order
router.patch('/orders/:id/cancel', async (req, res) => {
  try {
    const cancelledOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    );
    if (!cancelledOrder) return res.status(404).json({ message: 'Order not found' });
    console.log('Order cancelled:', req.params.id);
    res.json(cancelledOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *         examples:
 *           application/json:
 *             message: "Order deleted"
 *       404:
 *         description: Order not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *         examples:
 *           application/json:
 *             message: "Order not found"
 */

// Delete Order
router.delete('/orders/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    console.log('Order deleted:', req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
