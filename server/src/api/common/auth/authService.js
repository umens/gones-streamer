/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const UserService = require('../user/userService');
const cipher = require('./cipherHelper');
const emailService = require('../../../utils/emailService');

class AuthService {
  constructor() {
    this.userService = new UserService();
  }

  register(user) {
    return this.userService.findByEmail(user.email)
      .then(u => {
        if (u) {
          throw new Error('User already exists');
        }

        const { salt, passwordHash } = cipher.saltHashPassword(user.password);
        const newUser = {
          email: user.email,
          fullName: user.fullName,
          role: 'user',
          salt,
          passwordHash,
        };
        return this.userService.addUser(newUser);
      });
  }

  resetPassword(password, confirmPassword, resetPasswordToken) {
    if (password.length < 6) {
      throw new Error('Password should be longer than 6 characters');
    }

    if (password !== confirmPassword) {
      throw new Error('Password and its confirmation do not match.');
    }

    const tokenContent = cipher.decipherResetPasswordToken(resetPasswordToken);
    if (new Date().getTime() > tokenContent.valid) {
      throw new Error('Reset password token has expired.');
    }

    const { salt, passwordHash } = cipher.saltHashPassword(password);
    return this.userService.changePassword(tokenContent.userId, salt, passwordHash);
  }

  requestPassword(email) {
    return this.userService
      .findByEmail(email)
      .then(user => {
        if (user) {
          const token = cipher.generateResetPasswordToken(user._id);
          return emailService.sendResetPasswordEmail(email, user.fullName, token);
        }
        throw new Error('There is no defined email in the system.');
      });
  }
}

module.exports = AuthService;
