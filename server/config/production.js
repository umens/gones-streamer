/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

module.exports = {

  api: {
    port: 3002,
    root: '/api',
  },

  frontEnd: {
    domain: 'https://streamer.malo-box.ovh',
  },

  auth: {
    jwt: {
      secret: '5edb26e5-ec21-4150-9fde-57735eabba99',
    },
    resetPassword: {
      secret: '27e048c1-5575-4807-873e-5b3775419286',
    },
  },

  db: {
    url: 'mongodb://mongo:27017/gones-streamer',
    name: 'gones-streamer',
  },
};
