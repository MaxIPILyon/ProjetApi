const Configuration = require('../models/configuration');

module.exports.getConfigurations = async (query) => {
  try {
    return await Configuration.find(query)
      .populate('user', 'username email')
      .populate('components');
  } catch (e) {
    throw Error('Error while querying configurations: ' + e);
  }
};
