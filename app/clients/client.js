'use strict';

var bo = require('bograch');
var config = require('../../config');

var client = bo.client('amqp', {
  name: 'client',
  amqpURL: config.get('amqpURL')
});

client.register('query');

client.connect();

module.exports = client.methods;