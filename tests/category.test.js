require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Category = require('../models/category');
const User = require('../models/user'); // si l'utilisateur est nécessaire pour obtenir un JWT
const jwt = require('jsonwebtoken');

let token;

beforeAll(async () => {
  // Connexion à la base de données de test
  await mongoose.connect(process.env.MONGO_URL_TEST);

  // Créer un utilisateur fictif et générer un JWT
  const user = new User({ email: 'admin@test.com', password: 'password' });
  await user.save();

  token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await Category.deleteMany();
});

describe('GET /categories', () => {
  it('devrait retourner une liste vide de catégories', async () => {
    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /categories', () => {
  it('devrait créer une catégorie avec un token valide', async () => {
    const res = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Informatique' });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Informatique');
  });

  it('devrait refuser la création sans token', async () => {
    const res = await request(app).post('/categories').send({ name: 'Musique' });

    expect(res.statusCode).toBe(401); // ou 403 selon ton middleware
  });

  it('devrait refuser un nom de catégorie déjà existant', async () => {
    await Category.create({ name: 'Sport' });

    const res = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Sport' });

    expect(res.statusCode).toBe(400); // ou autre selon ta gestion d’erreur
  });
});
