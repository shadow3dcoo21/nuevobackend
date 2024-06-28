//Oficial   
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mensajeSchema = new Schema({
  videoId: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  mensaje: { type: String, required: true },
  fechaEnvio: { type: Date, default: Date.now },
  // Otros campos si es necesario
});

const Mensaje = mongoose.model('Mensaje', mensajeSchema);

module.exports = Mensaje;
