const mongoose = require('mongoose');
require('dotenv').config(); // Charge les variables d’environnement

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST);
});

afterAll(async () => {
  await mongoose.connection.close();
});
