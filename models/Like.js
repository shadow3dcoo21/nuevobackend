//Oficial
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  videoId: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  // Otros campos si es necesario
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
