const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const uri = 'mongodb://localhost:27017/smsDB';
app.use(cors());
app.use(bodyParser.json());

// Connexion MongoDB
mongoose.connect(uri).then(() => console.log("MongoDB connecté"))
  .catch(err => console.error("Erreur MongoDB:", err));

// Routes
const smsRoutes = require('./routes/smsRoutes');
app.use('/api', smsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
