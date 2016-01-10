'use strict'
const joi = require('joi')

module.exports = function(ms, opts, next) {
  ms.method({
    name: 'getByUsername',
    config: {
      validate: {
        username: joi.string().required(),
      },
    },
    handler(params, cb) {
      let options = params.options || {}
      options.fields = options.fields || []

      ms.plugins.models.User
        .findOne({ username: params.username }, options.fields.join(' '), cb);
    },
  });

  next()
}

module.exports.attributes = {
  name: 'get-by-username',
}