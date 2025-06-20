const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const app = require('../app'); // Ton app Express
const Category = require('../models/category');
const Component = require('../models/component');

const JWT_SECRET = 'testsecret';

// Tokens pour tests
function generateAdminToken() {
  return jwt.sign({ userId: 'adminuser', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
}
function generateUserToken() {
  return jwt.sign({ userId: 'normaluser', role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
}

describe('Component API', () => {
  let mongoServer;
  let categoryId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Crée une catégorie avant chaque test pour lien
    const category = await Category.create({ name: 'TestCategory' });
    categoryId = category._id;
  });

  afterEach(async () => {
    // Nettoyage des collections après chaque test
    await Component.deleteMany();
    await Category.deleteMany();
  });

  describe('GET /categories', () => {
    it('should return categories list', async () => {
      const res = await request(app).get('/categories');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('name', 'TestCategory');
    });
  });

  describe('GET /categories/:id/components', () => {
    it('should return components for a category', async () => {
      // Crée deux composants liés à la catégorie
      await Component.create([
        { category: categoryId, brand: 'BrandA', title: 'Comp1', price: 10 },
        { category: categoryId, brand: 'BrandB', title: 'Comp2', price: 20 },
      ]);

      const res = await request(app).get(`/categories/${categoryId}/components`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('title');
    });

    it('should return empty array if no components', async () => {
      const res = await request(app).get(`/categories/${categoryId}/components`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /components', () => {
    it('should return all components', async () => {
      await Component.create([
        { category: categoryId, brand: 'BrandA', title: 'Comp1', price: 10 },
        { category: categoryId, brand: 'BrandB', title: 'Comp2', price: 20 },
      ]);

      const res = await request(app).get('/components');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /components/:id', () => {
    it('should return one component by id', async () => {
      const component = await Component.create({
        category: categoryId,
        brand: 'BrandX',
        title: 'ComponentX',
        price: 50,
      });

      const res = await request(app).get(`/components/${component._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('title', 'ComponentX');
      expect(res.body).toHaveProperty('brand', 'BrandX');
    });

    it('should return 404 if component not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/components/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /components', () => {
    it('should create component if admin', async () => {
      const token = generateAdminToken();
      const data = {
        category: categoryId.toString(),
        brand: 'BrandNew',
        title: 'NewComp',
        specs: 'Specs here',
        price: 100,
        imageUrl: 'http://image.url',
      };

      const res = await request(app)
        .post('/components')
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('title', 'NewComp');

      // Check DB
      const comp = await Component.findOne({ title: 'NewComp' });
      expect(comp).not.toBeNull();
      expect(comp.brand).toBe('BrandNew');
    });

    it('should fail 401 if no token', async () => {
      const res = await request(app)
        .post('/components')
        .send({ category: categoryId.toString(), title: 'CompNoAuth' });

      expect(res.statusCode).toBe(401);
    });

    it('should fail 403 if user not admin', async () => {
      const token = generateUserToken();

      const res = await request(app)
        .post('/components')
        .set('Authorization', `Bearer ${token}`)
        .send({ category: categoryId.toString(), title: 'CompNoAdmin' });

      expect(res.statusCode).toBe(403);
    });

    it('should fail 400 if required fields missing', async () => {
      const token = generateAdminToken();

      const res = await request(app)
        .post('/components')
        .set('Authorization', `Bearer ${token}`)
        .send({ brand: 'BrandOnly' }); // Pas de category ni title

      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /components/:id', () => {
    it('should update component if admin', async () => {
      const token = generateAdminToken();
      const comp = await Component.create({
        category: categoryId,
        brand: 'BrandOld',
        title: 'CompOld',
        price: 30,
      });

      const res = await request(app)
        .put(`/components/${comp._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ brand: 'BrandUpdated', price: 99 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('brand', 'BrandUpdated');
      expect(res.body).toHaveProperty('price', 99);

      // Check DB
      const updated = await Component.findById(comp._id);
      expect(updated.brand).toBe('BrandUpdated');
      expect(updated.price).toBe(99);
    });

    it('should fail 401 if no token', async () => {
      const comp = await Component.create({
        category: categoryId,
        brand: 'BrandOld',
        title: 'CompOld',
      });

      const res = await request(app)
        .put(`/components/${comp._id}`)
        .send({ brand: 'NoAuth' });

      expect(res.statusCode).toBe(401);
    });

    it('should fail 403 if user not admin', async () => {
      const token = generateUserToken();
      const comp = await Component.create({
        category: categoryId,
        brand: 'BrandOld',
        title: 'CompOld',
      });

      const res = await request(app)
        .put(`/components/${comp._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ brand: 'NoAdmin' });

      expect(res.statusCode).toBe(403);
    });

    it('should return 404 if component not found', async () => {
      const token = generateAdminToken();
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/components/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ brand: 'NoComp' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /components/:id', () => {
    it('should delete component if admin', async () => {
      const token = generateAdminToken();
      const comp = await Component.create({
        category: categoryId,
        brand: 'BrandToDelete',
        title: 'CompDelete',
      });

      const res = await request(app)
        .delete(`/components/${comp._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(204);

      const found = await Component.findById(comp._id);
      expect(found).toBeNull();
    });

    it('should fail 401 if no token', async () => {
      const comp = await Component.create({
        category: categoryId,
        brand: 'BrandNoAuth',
        title: 'CompNoAuth',
      });

      const res = await request(app).delete(`/components/${comp._id}`);

      expect(res.statusCode).toBe(401);
    });

    it('should fail 403 if user not admin', async () => {
      const token = generateUserToken();
      const comp = await Component.create({
        category: categoryId,
        brand: 'BrandNoAdmin',
        title: 'CompNoAdmin',
      });

      const res = await request(app)
        .delete(`/components/${comp._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
    });

    it('should return 404 if component not found', async () => {
      const token = generateAdminToken();
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/components/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
