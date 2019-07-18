const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const ORM = require('sequelize');

const connectionString = process.env.DATABASE_URL ||
                        'postgres://chatroom:guest@localhost:5432/chatroom';
const connection = new ORM(connectionString, { logging: false });


// models

const Message = connection.define('message', {
  id: {
    type: ORM.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  author: {
    type: ORM.TEXT,
    allowNull: false,
  },
  time: {
    type: ORM.INTEGER,
    allowNull: false,
  },
  content: {
    type: ORM.TEXT,
    allowNull: false,
  },
  room: {
    type: ORM.TEXT,
    allowNull: false,
  },
}, { freezeTableName: true });


// routes

app.get('/hydrate', (req, res)=>{
  Message.sync({ force: true })
    .then(()=> res.json({ message: 'success' }))
    .catch(err => console.error(err)|| res.status(500).json({ err }))
});


app.get('/message', (req, res)=>{
  
});
