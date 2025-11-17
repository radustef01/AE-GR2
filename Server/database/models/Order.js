// server/database/models/Order.js
const { sequelize } = require('../server');
const { DataTypes } = require('sequelize');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',   // numele tabelului User
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  // păstrăm produsele comenzii ca JSON (snapshot la momentul comenzii)
  items: {
    // [{ productId, name, price, quantity }]
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Total cannot be negative',
      },
    },
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Processing', 'Completed', 'Canceled'),
    allowNull: false,
    defaultValue: 'Pending',
  },
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Order;
