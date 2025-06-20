const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const app = require('../app'); // Ton app Express
const Partenaires = require('../models/partenaires');

const JWT_SECRET = 'testsecret';

// Génère un token admin valide
function generateAdminToken() {
  return jwt.sign({ userId: 'adminuser', role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
}

// Génère un token user non admin
function generateUserToken() {
  return jwt.sign({ userId: 'normaluser', role: 'user' }, JWT_SECRET, { expiresIn: '1h' });
}

describe('Partenaires API', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Partenaires.deleteMany();
  });

  describe('GET /partenaires', () => {
    it('should return empty array if no partenaires', async () => {
      const res = await request(app).get('/partenaires');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return list of partenaires', async () => {
      await Partenaires.create({
        nomDuSite: 'Site1',
        url: 'https://site1.com',
        idSychornisation: 'sync123',
        conditionsAffiliation: 'Conditions 1'
      });
      await Partenaires.create({
        nomDuSite: 'Site2',
        url: 'https://site2.com',
        idSychornisation: 'sync456',
        conditionsAffiliation: 'Conditions 2'
      });

      const res = await request(app).get('/partenaires');
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.map(p => p.nomDuSite)).toEqual(expect.arrayContaining(['Site1', 'Site2']));
    });
  });

  describe('POST /partenaires', () => {
    it('should create partenaire if admin', async () => {
      const token = generateAdminToken();

      const data = {
        nomDuSite: 'SiteNew',
        url: 'https://sitenew.com',
        idSychornisation: 'sync999',
        conditionsAffiliation: 'Conditions new'
      };

      const res = await request(app)
        .post('/partenaires')
        .set('Authorization', `Bearer ${token}`)
        .send(data);

      expect(res.statusCode).toBe(201);
      expect(res.body.nomDuSite).toBe(data.nomDuSite);

      const partenaireInDb = await Partenaires.findOne({ nomDuSite: data.nomDuSite });
      expect(partenaireInDb).not.toBeNull();
    });

    it('should fail with 401 if no token', async () => {
      const res = await request(app)
        .post('/partenaires')
        .send({
          nomDuSite: 'SiteNoAuth',
          url: 'https://noauth.com',
          idSychornisation: 'sync000',
          conditionsAffiliation: 'Cond'
        });

      expect(res.statusCode).toBe(401);
    });

    it('should fail with 403 if not admin', async () => {
      const token = generateUserToken();

      const res = await request(app)
        .post('/partenaires')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nomDuSite: 'SiteUser',
          url: 'https://user.com',
          idSychornisation: 'sync111',
          conditionsAffiliation: 'Cond user'
        });

      expect(res.statusCode).toBe(403);
    });

    it('should fail with 400 if missing required fields', async () => {
      const token = generateAdminToken();

      const res = await request(app)
        .post('/partenaires')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nomDuSite: 'MissingFields'
          // missing url, idSychornisation, conditionsAffiliation
        });

      expect(res.statusCode).toBe(400);
    });

    it('should fail if duplicate unique fields', async () => {
      const token = generateAdminToken();

      const partenaire = {
        nomDuSite: 'DupSite',
        url: 'https://dupsite.com',
        idSychornisation: 'syncdup',
        conditionsAffiliation: 'Cond dup'
      };

      await Partenaires.create(partenaire);

      const res = await request(app)
        .post('/partenaires')
        .set('Authorization', `Bearer ${token}`)
        .send(partenaire);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /partenaires/:id', () => {
    it('should update partenaire if admin', async () => {
      const token = generateAdminToken();

      const partenaire = await Partenaires.create({
        nomDuSite: 'ToUpdate',
        url: 'https://toupdate.com',
        idSychornisation: 'syncupdate',
        conditionsAffiliation: 'Old cond'
      });

      const res = await request(app)
        .put(`/partenaires/${partenaire._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ conditionsAffiliation: 'New cond' });

      expect(res.statusCode).toBe(200);
      expect(res.body.conditionsAffiliation).toBe('New cond');

      const updated = await Partenaires.findById(partenaire._id);
      expect(updated.conditionsAffiliation).toBe('New cond');
    });

    it('should fail 404 if partenaire not found', async () => {
      const token = generateAdminToken();
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/partenaires/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ conditionsAffiliation: 'New cond' });

      expect(res.statusCode).toBe(404);
    });

    it('should fail 401 if no token', async () => {
      const partenaire = await Partenaires.create({
        nomDuSite: 'NoTokenUpdate',
        url: 'https://notoken.com',
        idSychornisation: 'syncnotoken',
        conditionsAffiliation: 'Cond'
      });

      const res = await request(app)
        .put(`/partenaires/${partenaire._id}`)
        .send({ conditionsAffiliation: 'Try update' });

      expect(res.statusCode).toBe(401);
    });

    it('should fail 403 if not admin', async () => {
      const token = generateUserToken();

      const partenaire = await Partenaires.create({
        nomDuSite: 'NoAdminUpdate',
        url: 'https://noadmin.com',
        idSychornisation: 'syncnoadmin',
        conditionsAffiliation: 'Cond'
      });

      const res = await request(app)
        .put(`/partenaires/${partenaire._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ conditionsAffiliation: 'Try update' });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /partenaires/:id', () => {
    it('should delete partenaire if admin', async () => {
      const token = generateAdminToken();

      const partenaire = await Partenaires.create({
        nomDuSite: 'ToDelete',
        url: 'https://todelete.com',
        idSychornisation: 'syncdelete',
        conditionsAffiliation: 'Cond delete'
      });

      const res = await request(app)
        .delete(`/partenaires/${partenaire._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);

      const deleted = await Partenaires.findById(partenaire._id);
      expect(deleted).toBeNull();
    });

    it('should fail 404 if partenaire not found', async () => {
      const token = generateAdminToken();
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/partenaires/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
    });

    it('should fail 401 if no token', async () => {
      const partenaire = await Partenaires.create({
        nomDuSite: 'NoTokenDelete',
        url: 'https://notokendelete.com',
        idSychornisation: 'syncnotokendelete',
        conditionsAffiliation: 'Cond'
      });

      const res = await request(app)
        .delete(`/partenaires/${partenaire._id}`);

      expect(res.statusCode).toBe(401);
    });

    it('should fail 403 if not admin', async () => {
      const token = generateUserToken();

      const partenaire = await Partenaires.create({
        nomDuSite: 'NoAdminDelete',
        url: 'https://noadmindelete.com',
        idSychornisation: 'syncnoadmindelete',
        conditionsAffiliation: 'Cond'
      });

      const res = await request(app)
        .delete(`/partenaires/${partenaire._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
    });
  });
});
