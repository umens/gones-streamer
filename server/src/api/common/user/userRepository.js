/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const { ObjectID } = require('mongodb');
const BaseRepository = require('../../../db/baseRepository');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  findById(id) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .aggregate([
          { $match: { _id: ObjectID(id) } },
          { $lookup: { from: 'settings', localField: '_id', foreignField: '_id', as: 'settings' } },
          { $limit: 1 },
        ])
        .toArray()
      )
      .then(data => (data && data.length ? data[0] : data));
  }

  findByEmail(email) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .findOne({ email }));
  }

  changePassword(id, salt, passwordHash) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .updateOne({ _id: ObjectID(id) }, { $set: { salt, passwordHash } }));
  }

  listFiltered(filter) {
    filter.query = {};

    // names here are not fully consistent with naming convention for compatibility with ng2-smart-table api on UI
    if (filter.filterByfirstName) {
      filter.query.firstName = { $regex: filter.filterByfirstName, $options: '-i' };
    }
    if (filter.filterBylastName) {
      filter.query.lastName = { $regex: filter.filterBylastName, $options: '-i' };
    }
    if (filter.filterByuserName) {
      filter.query.fullName = { $regex: filter.filterByuserName, $options: '-i' };
    }
    if (filter.filterByemail) {
      filter.query.email = { $regex: filter.filterByemail, $options: '-i' };
    }
    if (filter.filterByage) {
      filter.query.age = filter.filterByage;
    }
    if (filter.filterBystreet) {
      filter.query['address.street'] = { $regex: filter.filterBystreet, $options: '-i' };
    }
    if (filter.filterBycity) {
      filter.query['address.city'] = { $regex: filter.filterBycity, $options: '-i' };
    }
    if (filter.filterByzipcode) {
      filter.query['address.zipCode'] = { $regex: filter.filterByzipcode, $options: '-i' };
    }
    return super.listFiltered(filter);
  }

  // TODO: implement photo return
  getPhoto(userId) {
    return [];
    // return this.dbClient
    //   .then(db => db
    //     .collection(this.collection)
    //   )
  }
}

module.exports = UserRepository;
