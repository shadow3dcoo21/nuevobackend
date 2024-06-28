// auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario'); // Asegúrate de que la ruta del modelo sea correcta

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { username, email, nombre, fotoPerfil, contraseña } = req.body;

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    // Crear el nuevo usuario
    const nuevoUsuario = new Usuario({
      username,
      email,
      nombre,
      fotoPerfil,
      contraseña, // Guardar la contraseña en texto plano
    });

    // Guardar el usuario en la base de datos
    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  const { username, contraseña } = req.body;

  try {
    // Buscar el usuario por username en la base de datos
    const usuario = await Usuario.findOne({ username });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Comparar la contraseña (en texto plano, ya que eliminaste el cifrado temporalmente)
    if (contraseña !== usuario.contraseña) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token de sesión usando JWT
    const token = jwt.sign({ username: usuario.username, id: usuario._id }, 'secreto', { expiresIn: '1h' }); // Cambia 'secreto' por una cadena segura y secreta en producción

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Middleware para verificar el token de sesión
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Obtener token del header Authorization

  if (!token) {
    return res.status(403).json({ error: 'Token de sesión no proporcionado' });
  }

  jwt.verify(token, 'secreto', (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Token de sesión inválido' });
    }
    req.usuario = decodedToken; // Decodificar y pasar el usuario al request
    next();
  });
};

// Ruta para verificar el estado de la sesión
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    // Buscar el usuario por ID usando el token decodificado
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
