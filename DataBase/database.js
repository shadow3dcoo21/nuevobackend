//Oficial
const mongoose = require('mongoose');
mongoose.connect('mongodb://ec2-3-91-81-99.compute-1.amazonaws.com:27017/tiktok', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Conexion establecida');
});

// Importar modelos
const Video = require('../models/Video');
const Usuario = require('../models/Usuario');
const Mensaje = require('../models/Mensaje');
const Like = require('../models/Like');
const Amigo = require('../models/Amigo');

module.exports = {
    Video,
    Usuario,
    Mensaje,
    Like,
    Amigo,
  };