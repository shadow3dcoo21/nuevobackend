//Oficial
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const amigoSchema = new Schema({
  usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  amigoId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  estado: { type: String, enum: ['activo', 'pendiente', 'bloqueado'], default: 'pendiente' },
  // Otros campos si es necesario
});

const Amigo = mongoose.model('Amigo', amigoSchema);

module.exports = Amigo;
