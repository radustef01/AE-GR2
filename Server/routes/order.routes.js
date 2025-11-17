// server/routes/order.routes.js
const express = require('express');
const { Order, Product, User } = require('../database/models');
const { verifyToken } = require('../utils/token.js');
console.log('verifyToken in order.routes.js =', typeof verifyToken);

const router = express.Router();

/**
 * POST /orders
 * Creează o comandă nouă din produsele din cart.
 * Body: { items: [ { productId, quantity } ] }
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required',
        data: {},
      });
    }

    // validare cantități > 0
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have productId and quantity > 0',
          data: {},
        });
      }
    }

    const productIds = items.map((i) => i.productId);

    // luăm produsele din DB ca să folosim prețurile actuale
    const products = await Product.findAll({
      where: { id: productIds },
    });

    if (products.length !== items.length) {
      return res.status(400).json({
        success: false,
        message: 'Some products were not found',
        data: {},
      });
    }

    // construim snapshot-ul de items pentru comandă
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const total = orderItems.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    );

    const order = await Order.create({
      userId: req.userId,     // pus de verifyToken
      items: orderItems,
      total,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      data: error.message,
    });
  }
});

/**
 * GET /orders/me
 * Returnează comenzile userului logat.
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.userId },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      data: error.message,
    });
  }
});

/**
 * GET /orders
 * Doar admin – vede toate comenzile.
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
        data: {},
      });
    }

    // 1. Luăm toate comenzile
    const orders = await Order.findAll({
      order: [['created_at', 'DESC']],
    });

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Orders fetched successfully',
        data: [],
      });
    }

    // 2. Extragem userId-urile distincte
    const userIds = [...new Set(orders.map((o) => o.userId))];

    // 3. Luăm userii corespunzători
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ['id', 'name', 'email'],
    });

    const usersById = {};
    users.forEach((u) => {
      usersById[u.id] = u;
    });

    // 4. Construim obiectele finale cu userName și userEmail
    const formatted = orders.map((order) => {
      const plain = order.toJSON();
      const u = usersById[plain.userId];

      return {
        ...plain,
        userName: u ? u.name : null,
        userEmail: u ? u.email : null,
      };
    });

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      data: error.message,
    });
  }
});

/**
 * GET /orders/:id
 * User-ul își poate vedea doar comenzile lui,
 * adminul poate vedea orice.
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Order id is not valid',
        data: {},
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        data: {},
      });
    }

    // user normal: poate vedea doar comenzile lui
    if (req.userRole !== 'admin' && order.userId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      data: error.message,
    });
  }
});

/**
 * PUT /orders/:id
 * Admin – schimbă statusul comenzii.
 * Body: { status: 'Pending' | 'Processing' | 'Completed' | 'Canceled' }
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
        data: {},
      });
    }

    const id = req.params.id;
    const { status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Order id is not valid',
        data: {},
      });
    }

    const allowed = ['Pending', 'Processing', 'Completed', 'Canceled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
        data: {},
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        data: {},
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      data: error.message,
    });
  }
});

module.exports = router;
