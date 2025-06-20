const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const app = require('../app'); // Ton app Express
const Category = require('../models/category');

// Clé secrète JWT utilisée dans ton middleware d'auth
const JWT_SECRET = 'testsecret';

// Génère un token admin pour tests
function generateAdminToken() {
  return jwt.sign({ userId: 'testuser', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
}

// Génère un token utilisateur non admin
function generateUserToken() {
  return jwt.sign({ userId: 'testuser', role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
}

describe('Category API', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Clean db after each test
    await Category.deleteMany();
  });

  describe('GET /categories', () => {
    it('should return empty array if no categories', async () => {
      const res = await request(app).get('/categories');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return categories list', async () => {
      await Category.create({ name: 'Tech' });
      await Category.create({ name: 'Food' });

      const res = await request(app).get('/categories');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.map(c => c.name)).toEqual(expect.arrayContaining(['Tech', 'Food']));
    });
  });

  describe('POST /categories', () => {
    it('should create category if user is admin', async () => {
      const token = generateAdminToken();

      const res = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Sports' });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('Sports');

      // Verify saved in DB
      const cat = await Category.findOne({ name: 'Sports' });
      expect(cat).not.toBeNull();
    });

    it('should fail with 401 if no token', async () => {
      const res = await request(app)
        .post('/categories')
        .send({ name: 'Music' });

      expect(res.statusCode).toBe(401);
    });

    it('should fail with 403 if user is not admin', async () => {
      const token = generateUserToken();

      const res = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Music' });

      expect(res.statusCode).toBe(403);
    });

    it('should fail with 400 if name missing', async () => {
      const token = generateAdminToken();

      const res = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toBe(400);
    });

    it('should fail if category name already exists', async () => {
      const token = generateAdminToken();

      await Category.create({ name: 'Travel' });

      const res = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Travel' });

      expect(res.statusCode).toBe(400);
    });
  });
});
