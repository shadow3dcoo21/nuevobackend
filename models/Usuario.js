const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  nombre: { type: String },
  fotoPerfil: { type: String },
  contraseña: { type: String, required: true } // No cifraremos la contraseña por ahora
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;