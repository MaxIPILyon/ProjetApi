const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const fs = require('fs'); // fileSystem
const path = require('path');

// Class model
const User = require("./models/user");
const Category = require("./models/category");

// const userApiService = require('./services/userApiService');
const userService = require("./services/userService");

const userApiRoute = require("./routes/userApiRoute");
const userAuthRoutes = require("./routes/userAuthRoutes");
const partenairesRoutes = require('./routes/partenairesRoutes');
const componentRoutes = require('./routes/componentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const configRoutes = require('./routes/configRoutes');

const cors = require('cors');
const {authenticateToken, isAdmin} = require('./middlewares/authMiddlewares');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConf'); // Chemin d'accès au fichier de définition de swagger



const app = express();

const PORT = process.env.PORT || 8090;

//charge le fichier de configuration
dotenv.config();

//Connexion à la BDD
mongoose.connect(process.env.MONGO_CONNECTION)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((e) => console.log('Connexion à MongoDB échouée !' + e));




// test création d'un User
// TODO vérifier si admin existe pas déjà

// userService.createUser(
//   User({
//     firstName: "Admin",
//     lastName: "Admin",
//     email: "Admin@Admin",
//     username: "Admin",
//     password: "admin123",
//     admin: true
//   }
//   )
// )

// http://localhost:8090


// création en bases des catégories par défaut
Category.countDocuments()
  .then(count => {
    if (count === 0) {
      const rawData = fs.readFileSync('./categories.json', 'utf8');
      const categories = JSON.parse(rawData);

      Category.insertMany(categories)
        .then(() => console.log('Catégories par défaut insérées'))
        .catch(err => console.error('Erreur insertMany :', err));
    } else {
      console.log('Catégories déjà présentes');
    }
  })
  .catch(err => console.error('Erreur countDocuments :', err));


  // Démarrage du serveur
app.listen(8090, () => {
  console.log('Le serveur est démarré sur le port 8090 !');
  console.log(`La documentation de l'API est disponible à l'adresse suivante http://localhost:${PORT}/api-docs`);
});

// app.get('/', (req, res) => {
//      res.send('index.html'); 
// });


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// permet de récuprer les données dans le body au format JSON
app.use(bodyParser.json());

// indique l'url de départ des routes pour userApiRoute
app.use("/api/user", userApiRoute);

// routes pour l'authentification
app.use("/auth", userAuthRoutes);

// routes protégées
app.use('/api', authenticateToken);

app.use('/api', categoryRoutes);

app.use('/api', componentRoutes);

app.use('/api', partenairesRoutes);

app.use('/api', configRoutes);

app.use(cors());

app.use(express.static('public'));

// Servir l'interface utilisateur Swagger à un itinéraire spécifique
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ... vos routes API
app.get('/api/status', (req, res) => {
  res.json({ message: 'L API est en cours d\'exécution' });
});
