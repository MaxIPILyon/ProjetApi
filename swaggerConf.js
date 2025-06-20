// swaggerConf.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Spécifier la version de l'OpenAPI
    info: {
      title: 'ConfigurateurPC.API',
      version: '1.0.0',
      description: 'Documentation ConfigurateurPC.API',
      contact: {
        name: 'Team JMM',
        email: 'jmm.team@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8090', // Ajustez l'URL de base de votre API
        description: 'Server API',
      },
      // Vous pouvez ajouter d'autres URL de serveurs pour la mise à l'essai, la production, etc.
    ],
    components: {
        securitySchemes: {
          bearerAuth: { // Il définit un schéma de sécurité pour les JWT
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter JWT Bearer token **_only_**',
          },
        },
      },
    security: [{
      bearerAuth: []
    }], // Appliquer la sécurité globalement (ou par point d'extrémité)
  },
  // Liste des fichiers à analyser pour la documentation de l'API (commentaires JSDoc)
  apis: ['./routes/*.js', './models/*.js'], // Ajustez les chemins d'accès à l'endroit où vos itinéraires et vos schémas sont définis.
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;