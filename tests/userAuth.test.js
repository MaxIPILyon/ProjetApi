const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/user');

describe('User Auth API', () => {
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

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          username: 'johndoe',
          password: 'Password123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toMatch(/registered/i);

      // Check user in DB (password should be hashed so we check presence)
      const user = await User.findOne({ username: 'johndoe' });
      expect(user).not.toBeNull();
      expect(user.email).toBe('john@example.com');
      expect(user.password).not.toBe('Password123'); // assuming hashed
    });

    it('should fail if required fields missing', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          firstName: 'Jane'
          // missing lastName, email, username, password
        });

      expect(res.statusCode).toBe(400);
    });

    it('should fail if username already exists', async () => {
      await User.create({
        firstName: 'Existing',
        lastName: 'User',
        email: 'exist@example.com',
        username: 'existinguser',
        password: 'hashedpwd'
      });

      const res = await request(app)
        .post('/register')
        .send({
          firstName: 'New',
          lastName: 'User',
          email: 'new@example.com',
          username: 'existinguser',
          password: 'Password123'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      // Create a user with hashed password
      const bcrypt = require('bcryptjs');
      const hashedPwd = await bcrypt.hash('Password123', 10);

      await User.create({
        firstName: 'Login',
        lastName: 'User',
        email: 'loginuser@example.com',
        username: 'loginuser',
        password: hashedPwd,
        admin: false
      });
    });

    it('should login with username and return token', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          username: 'loginuser',
          password: 'Password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });

    it('should login with email and return token', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          email: 'loginuser@example.com',
          password: 'Password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          username: 'loginuser',
          password: 'WrongPassword'
        });

      expect(res.statusCode).toBe(401);
    });

    it('should fail if user does not exist', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          username: 'notexists',
          password: 'Password123'
        });

      expect(res.statusCode).toBe(401);
    });

    it('should fail if no password provided', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          username: 'loginuser'
        });

      expect(res.statusCode).toBe(400);
    });
  });
});
