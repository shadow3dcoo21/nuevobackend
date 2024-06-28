const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios'); // Importa Axios aquí
const authRoutes = require('./routes/auth'); // Importa las rutas de autenticación
const { Video, Usuario, Mensaje, Like, Amigo } = require('./DataBase/database');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
//const dataRoutes = require('./routes/dataRoutes');



/////////////////////////////////////
// Middleware
app.use(bodyParser.json());
//app.use('/api', dataRoutes);
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);////

////////////////////////////////////


/////////////////////////////
//Rutas
app.get('/videos', async (req, res) => {
    try {
      const videos = await Video.find();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching videos' });
    }
  });
  

  app.post('/enviar-datos', async (req, res) => {
    try {
      const { watchTime, currentCategory, currentUser } = req.body;
      console.log('Recibiendo datos en el backend:', watchTime, currentCategory, currentUser);
  
      // Enviar los datos a la API de Python
      const response = await axios.post('http://localhost:5001/guardar-datos', {
        watchTime,
        currentCategory,
        currentUser,
      });
      console.log('Respuesta de la API de Python:', response.data);
  
      res.send('Datos enviados y procesados correctamente');
    } catch (error) {
      console.error('Error al enviar datos a la API de Python:', error);
      res.status(500).send('Error al procesar los datos');
    }
  });

// Importa y usa tu ruta de carga de videos
const uploadRouter = require('./routes/upload');
app.use('/uploads', uploadRouter);// es uploads
///////////////////////////////////



///////////////////////////////
//SACAR IP LOCALHOST
const os = require('os');
// Función para obtener la IP de localhost
function getLocalhostIP() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
      for (const config of iface) {
          if (config.family === 'IPv4' && !config.internal) {
              return config.address;
          }
      }
  }
  return '127.0.0.1';
}

// Ruta para mostrar la IP de localhost
app.get('/localhost-ip', (req, res) => {
  const localhostIP = getLocalhostIP();
  res.send(`La IP de localhost es: ${localhostIP}`);
});


// inicio
app.get('/', (req, res) => {
  
  res.send("Conectado Correctamente");
});
//////////////////////////////////



/////////////////////////////////
//CLOUDFLARE
const s3 = require('./CloudFlare/config');


const bucketName = 'tiktokvideo'; // Reemplaza con el nombre de tu bucket

// Configurar Multer para manejo de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para subir videos
app.post('/upload', upload.single('video'), (req, res) => {
  const file = req.file;
  const uploadParams = {
      Bucket: bucketName,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype
  };

  s3.upload(uploadParams, (err, data) => {
      if (err) {
          console.error('Error uploading video:', err);
          res.status(500).send('Error uploading video');
      } else {
          console.log('Video uploaded successfully:', data.Location);
          res.send(`Video uploaded successfully: ${data.Location}`);
      }
  });
});

// Ruta para obtener videos
app.get('/video/:key', (req, res) => {
  const getParams = {
      Bucket: bucketName,
      Key: req.params.key
  };

  s3.getObject(getParams, (err, data) => {
      if (err) {
          console.error('Error getting video:', err);
          res.status(500).send('Error getting video');
      } else {
          res.writeHead(200, {
              'Content-Type': data.ContentType,
              'Content-Length': data.ContentLength
          });
          res.write(data.Body);
          res.end();
      }
  });
});
///////////////////////////////////



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
