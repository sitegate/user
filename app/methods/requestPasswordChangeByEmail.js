'use strict';

var crypto = require('crypto');

var ONE_HOUR = 3600000;

module.exports = function(ms) {
  var User = ms.models.User;
  var mailer = ms.clients.mailer;

  function sendPasswordResetEmail(user, cb) {
    crypto.randomBytes(20, function(err, buffer) {
      if (err) {
        return cb(err, null);
      }

      var token = buffer.toString('hex');

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + ONE_HOUR;

      user.save(function(err, user) {
        if (err) {
          return cb(err, null);
        }

        mailer.send({
          templateName: 'reset-password-email',
          to: user.email,
          locals: {
            username: user.username,
            token: user.resetPasswordToken
          }
        }, cb);
      });
    });
  }

  return function(email, cb) {
    if (!email) {
      return cb(new TypeError('No email provided to reset password'), null);
    }

    User.findOne({
      email: email.toLowerCase()
    }, function(err, user) {
      if (err) {
        return cb(err, null);
      }

      if (!user) {
        return cb(new Error('There is no user with such email in our system'), null);
      }

      return sendPasswordResetEmail(user, cb);
    });
  };
};
