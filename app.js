const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const fs = require('fs'); // fileSystem

// Class model
const User = require ("./models/user");
const Category = require ("./models/category");

// const userApiService = require('./services/userApiService');
const userApiRoute = require ("./routes/userApiRoute");
const userAuthRoutes = require("./routes/userAuthRoutes");
const partenairesRoutes = require('./routes/partenairesRoutes');
const componentRoutes = require('./routes/componentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const configRoutes = require('./routes/configRoutes');
const cors = require('cors');
const verifyToken = require('./middlewares/authMiddlewares');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConf'); // Chemin d'accès au fichier de définition de swagger



// Parser le JSON
const categories = JSON.parse(fs.readFileSync('categories.json', 'utf8'));
const path = require('path');

const app = express();

const PORT = process.env.PORT || 8090;

//charge le fichier de configuration
dotenv.config();

mongoose.connect(process.env.MONGO_CONNECTION)
        .then(() =>console.log('Connexion à MongoDB réussie !'))
        .catch((e) =>console.log('Connexion à MongoDB échouée !' + e));


// permet de récuprer les données dans le body au format JSON
app.use(bodyParser.json());

// indique l'url de départ des routes pour userApiRoute
app.use("/api/user", userApiRoute);

// test création d'un User

// let user = new User(
//      {
//           firstName:"Maxence",
//           lastName:"Vanel", 
//           email:"max@test.fr",
//           password:"12345"
//      }
// );

// user.save()
//      .then((data) =>console.log(data))
//      .catch((error)=>console.log(error));

// http://localhost:8090


// création en bases des catégories par défaut
// categories.forEach(category => {

// const exists = Category.findOne({ name: category.name });
//   if (!exists)

//   let newcategory = new Category(
//     {
//       name:category.name
//     }
//   )

//   newcategory.save()
// });




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


app.listen(8090, () => {
     console.log('Le serveur est démarré sur le port 8090 !');
     console.log(`La documentation de l'API est disponible à l'adresse suivante http://localhost:${PORT}/api-docs`);
});

// app.get('/', (req, res) => {
//      res.send('index.html'); 
// });


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});


// routes pour l'authentification
app.use("/auth", userAuthRoutes);

// routes protégées
app.use('/api', verifyToken);

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
