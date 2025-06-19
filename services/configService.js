const Configuration = require('../models/config');

module.exports.getConfigurations = async (query) => {
  try {
    return await Configuration.find(query)
      .populate('user', 'username email')
      .populate('components');
  } catch (e) {
    throw Error('Error while querying configurations: ' + e);
  }
};

module.exports.getConfigurationById = async (query) => {
  try {
    return await Configuration.findOne(query)
      .populate('user', 'username email')
      .populate('components');
  } catch (e) {
    throw Error('Error while querying one Configuration: ' + e);
  }
};