'use strict';

/* Importing Models from the mongo */
const Models = require('../Models');


const find = function(criteria,  projection, callback){
	let options = {
		lean: true
	}
	Models.user.find(criteria, projection, options, callback)
};

const save = function(dataToSave, callback){
	new Models.user(dataToSave).save(callback)
};

const update = function(query, dataToUpdate, callback){
	let options = {
		lean: true,
		upsert: true
	};
	Models.user.update(query, dataToUpdate, options, callback)
}

const getOTP = function getOTP(criteria, projection, options, callback) {
  Models.otp.find(criteria, projection, options, callback);
};

const saveOTP = function saveOTP(objToSave, callback) {
  const newOTP = new Models.otp(objToSave);
  newOTP.save(callback);
};

module.exports = {
	find,
	save,
	update,
	getOTP,
	saveOTP
}