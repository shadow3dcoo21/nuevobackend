//Oficial
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  urlVideo: { type: String, required: true },
  fechaSubida: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  categorias: { type: [String] },
  // Otros campos del video
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
