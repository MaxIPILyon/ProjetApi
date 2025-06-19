const configurationService = require('../services/configService');

module.exports.getConfigurations = async (req, res) => {
  try {
    const { userId, from, to } = req.query;
    const filters = {};

    if (userId) filters.user = userId;
    if (from || to) {
      filters.createdAt = {};
      if (from) filters.createdAt.$gte = new Date(from);
      if (to) filters.createdAt.$lte = new Date(to);
    }

    const configs = await configurationService.getConfigurations(filters);

    const result = configs.map(config => {
      const total = config.components.reduce((sum, comp) => sum + (comp.price || 0), 0);
      return {
        _id: config._id,
        name: config.name,
        user: config.user,
        createdAt: config.createdAt,
        totalPrice: total,
        components: config.components
      };
    });

    return res.status(200).json({
      status: 200,
      data: result,
      message: "Successfully Configurations Retrieved"
    });

  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

module.exports.getConfiguration = async (req, res) => {
  try {
    const config = await configurationService.getConfigurationById({ _id: req.params.id });

    if (!config) {
      return res.status(404).json({ status: 404, message: "Configuration not found" });
    }

    const total = config.components.reduce((sum, comp) => sum + (comp.price || 0), 0);

    return res.status(200).json({
      status: 200,
      data: {
        _id: config._id,
        name: config.name,
        user: config.user,
        components: config.components,
        totalPrice: total,
        createdAt: config.createdAt
      },
      message: "Successfully Configuration Retrieved"
    });

  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
