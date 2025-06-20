const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const app = require('../app'); // Ton app Express
const Configuration = require('../models/config');
const User = require('../models/user'); // Si tu veux créer un user pour le champ user

const JWT_SECRET = 'testsecret';

// Génère un token admin
function generateAdminToken(userId) {
  return jwt.sign({ userId, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
}

// Génère un token user simple
function generateUserToken(userId) {
  return jwt.sign({ userId, role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
}

describe('Configuration API', () => {
  let mongoServer;
  let userId;
  let adminToken;
  let userToken;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Création d'un user fictif pour référencer dans configurations
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'hashedpwd' });
    userId = user._id.toString();

    adminToken = generateAdminToken(userId);
    userToken = generateUserToken(userId);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Configuration.deleteMany();
  });

  describe('GET /configurations', () => {
    it('should return empty array if no configurations', async () => {
      const res = await request(app).get('/configurations');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all configurations', async () => {
      await Configuration.create({ user: userId, name: 'Config 1', components: [] });
      await Configuration.create({ user: userId, name: 'Config 2', components: [] });

      const res = await request(app).get('/configurations');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.map(c => c.name)).toEqual(expect.arrayContaining(['Config 1', 'Config 2']));
    });
  });

  describe('GET /configurations/:id', () => {
    it('should return a configuration by id', async () => {
      const config = await Configuration.create({ user: userId, name: 'My Config', components: [] });

      const res = await request(app).get(`/configurations/${config._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('My Config');
    });

    it('should return 404 if configuration not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/configurations/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /configurations', () => {
    it('should create a configuration if authenticated', async () => {
      const res = await request(app)
        .post('/configurations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ user: userId, name: 'New Config', components: [] });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('New Config');
    });

    it('should return 401 if no token', async () => {
      const res = await request(app)
        .post('/configurations')
        .send({ user: userId, name: 'No Auth Config', components: [] });

      expect(res.statusCode).toBe(401);
    });

    it('should return 400 if name missing', async () => {
      const res = await request(app)
        .post('/configurations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ user: userId });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /configurations/:id', () => {
    it('should update configuration if admin', async () => {
      const config = await Configuration.create({ user: userId, name: 'Old Name', components: [] });

      const res = await request(app)
        .put(`/configurations/${config._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name' });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Name');
    });

    it('should fail with 401 if no token', async () => {
      const config = await Configuration.create({ user: userId, name: 'Old Name', components: [] });

      const res = await request(app)
        .put(`/configurations/${config._id}`)
        .send({ name: 'Updated Name' });

      expect(res.statusCode).toBe(401);
    });

    it('should fail with 403 if user not admin', async () => {
      const config = await Configuration.create({ user: userId, name: 'Old Name', components: [] });

      const res = await request(app)
        .put(`/configurations/${config._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Name' });

      expect(res.statusCode).toBe(403);
    });

    it('should return 404 if configuration not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/configurations/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /configurations/:id', () => {
    it('should delete configuration if admin', async () => {
      const config = await Configuration.create({ user: userId, name: 'To Delete', components: [] });

      const res = await request(app)
        .delete(`/configurations/${config._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);

      // Verify deleted
      const found = await Configuration.findById(config._id);
      expect(found).toBeNull();
    });

    it('should fail with 401 if no token', async () => {
      const config = await Configuration.create({ user: userId, name: 'To Delete', components: [] });

      const res = await request(app).delete(`/configurations/${config._id}`);

      expect(res.statusCode).toBe(401);
    });

    it('should fail with 403 if user not admin', async () => {
      const config = await Configuration.create({ user: userId, name: 'To Delete', components: [] });

      const res = await request(app)
        .delete(`/configurations/${config._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });

    it('should return 404 if configuration not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/configurations/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
