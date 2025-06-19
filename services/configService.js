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

module.exports.createConfiguration = async (config) => {
  try {
    return await config.save();
  } catch (e) {
    throw Error('Error while creating Configuration: ' + e);
  }
};

module.exports.updateConfiguration = async (query, config) => {
  try {
    return await Configuration.updateOne(query, config);
  } catch (e) {
    throw Error('Error while updating Configuration: ' + e);
  }
};

module.exports.deleteConfiguration = async (query) => {
  try {
    return await Configuration.deleteOne(query);
  } catch (e) {
    throw Error('Error while deleting Configuration: ' + e);
  }
};