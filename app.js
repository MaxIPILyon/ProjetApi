const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const User = require ("./models/user");
// const userApiService = require('./services/userApiService');
const userApiRoute = require ("./routes/userApiRoute");
const userAuthRoutes = require("./routes/userAuthRoutes");
const verifyToken = require('./middlewares/authMiddlewares');


const app = express();

//charge le fichier de configuration
dotenv.config();

mongoose.connect(process.env.MONGO_CONNECTION)
        .then(() =>console.log('Connexion à MongoDB réussie !'))
        .catch(() =>console.log('Connexion à MongoDB échouée !' + e));


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
app.get('/', (req, res) => {
     res.send('Accueil'); 
});

app.listen(8090, () => {
     console.log('Le serveur est démarré sur le port 8090 !');
});

// routes pour l'authentification
app.use("/auth", userAuthRoutes);

// routes protégées
app.use('/api', verifyToken);