const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const app = require('../app');
const User = require('../models/user');

const JWT_SECRET = 'testsecret';

function generateAdminToken() {
  return jwt.sign({ userId: 'adminid', admin: true }, JWT_SECRET, { expiresIn: '1h' });
}

function generateUserToken() {
  return jwt.sign({ userId: 'userid', admin: false }, JWT_SECRET, { expiresIn: '1h' });
}

describe('User API', () => {
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
    await User.deleteMany();
  });

  describe('GET /users', () => {
    it('should return empty array when no users', async () => {
      const res = await request(app).get('/users');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all users', async () => {
      await User.create([
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com', username: 'john', password: 'pass', admin: false },
        { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', username: 'jane', password: 'pass', admin: true },
      ]);

      const res = await request(app).get('/users');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(u => u.username === 'john')).toBe(true);
      expect(res.body.some(u => u.username === 'jane')).toBe(true);
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id', async () => {
      const user = await User.create({
        firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', username: 'alice', password: 'pass', admin: false
      });

      const res = await request(app).get(`/users/${user._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.username).toBe('alice');
    });

    it('should return 404 if user not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/users/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = {
        firstName: 'Bob',
        lastName: 'Brown',
        email: 'bob@example.com',
        username: 'bob',
        password: 'secret',
        admin: false,
      };

      const res = await request(app)
        .post('/users')
        .send(newUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.username).toBe('bob');

      const userInDb = await User.findOne({ username: 'bob' });
      expect(userInDb).not.toBeNull();
    });

    it('should fail if required fields missing', async () => {
      const res = await request(app).post('/users').send({ username: 'missingfields' });
      expect(res.statusCode).toBe(400);
    });

    it('should fail if username is duplicate', async () => {
      await User.create({
        firstName: 'Sam',
        lastName: 'Smith',
        email: 'sam@example.com',
        username: 'sam',
        password: 'secret',
        admin: false,
      });

      const res = await request(app)
        .post('/users')
        .send({
          firstName: 'Samuel',
          lastName: 'Smith',
          email: 'samuel@example.com',
          username: 'sam',
          password: 'secret',
          admin: false,
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user if authenticated admin', async () => {
      const user = await User.create({
        firstName: 'Claire',
        lastName: 'White',
        email: 'claire@example.com',
        username: 'claire',
        password: 'pass',
        admin: false,
      });

      const token = generateAdminToken();

      const res = await request(app)
        .put(`/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ lastName: 'Black' });

      expect(res.statusCode).toBe(200);
      expect(res.body.lastName).toBe('Black');

      const updated = await User.findById(user._id);
      expect(updated.lastName).toBe('Black');
    });

    it('should fail to update if no token', async () => {
      const user = await User.create({
        firstName: 'Claire',
        lastName: 'White',
        email: 'claire@example.com',
        username: 'claire',
        password: 'pass',
        admin: false,
      });

      const res = await request(app)
        .put(`/users/${user._id}`)
        .send({ lastName: 'Black' });

      expect(res.statusCode).toBe(401);
    });

    it('should fail to update if user is not admin', async () => {
      const user = await User.create({
        firstName: 'Claire',
        lastName: 'White',
        email: 'claire@example.com',
        username: 'claire',
        password: 'pass',
        admin: false,
      });

      const token = generateUserToken();

      const res = await request(app)
        .put(`/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ lastName: 'Black' });

      expect(res.statusCode).toBe(403);
    });

    it('should return 404 if user not found', async () => {
      const token = generateAdminToken();
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/users/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ lastName: 'Black' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user if admin', async () => {
      const user = await User.create({
        firstName: 'David',
        lastName: 'Green',
        email: 'david@example.com',
        username: 'david',
        password: 'pass',
        admin: false,
      });

      const token = generateAdminToken();

      const res = await request(app)
        .delete(`/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(204);

      const deleted = await User.findById(user._id);
      expect(deleted).toBeNull();
    });

    it('should fail delete if no token', async () => {
      const user = await User.create({
        firstName: 'David',
        lastName: 'Green',
        email: 'david@example.com',
        username: 'david',
        password: 'pass',
        admin: false,
      });

      const res = await request(app).delete(`/users/${user._id}`);
      expect(res.statusCode).toBe(401);
    });

    it('should fail delete if user not admin', async () => {
      const user = await User.create({
        firstName: 'David',
        lastName: 'Green',
        email: 'david@example.com',
        username: 'david',
        password: 'pass',
        admin: false,
      });

      const token = generateUserToken();

      const res = await request(app)
        .delete(`/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
    });

    it('should return 404 if user to delete not found', async () => {
      const token = generateAdminToken();
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/users/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
