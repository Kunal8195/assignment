'use strict'

/** 3rd party **/
const async = require('async');
const MD5 = require('md5');

/** External Dependencies **/
const Service = require('../Services');


const signUp = function(payload, callback){
	/*
	  payload:{
	    fullName:'Kunal Pal',
	    phoneNo: '9041306219',
	    email:'xyz@gmail.com',
	    password:'********',
	    dob:'08/12/1995',
	    doubleAuth:false //it remain false by default
	  }
	*/
	let dataToSave = payload;
	if(dataToSave.password)

		// encrypting the password
		dataToSave.password = CryptData(dataToSave.password)

	/*
	  executing asynchronous functions synchronously
	*/
	async.series([
		function(cb){

			// set the criteria for the query in mongo
			let criteria = {
				$or: [
				  {
				  	phoneNo: payload.phoneNo,
				  },
				  {
				  	email: payload.email
				  }

				]
			};
			let projection = {};

			/*
			  if any matching record is found correspond to that email and phone number
			  then it means a user is already registered
			*/
			Service.mongoService.find(criteria, projection, function(err, result){
				if(result.length){
					let dataToSend = {
						message:'phoneNo or Email already registered'
					};
					callback(dataToSend);
				} else {
					cb();
				}
			})
		},
		function(cb){

			// save the new user record in mongo
			Service.mongoService.save(dataToSave, function(err, result){
				if(err){
					callback(err)
				} else {
					cb();
				}
			})
		}
	],
	function(err, result){
		if(err){
			callback(err)
		} else {
			let dataToSend = {
				message: 'You have successfully registered'
			};
			callback(null, dataToSend);
		}
	}
	)

}

const socialSignUp = function(payload, callback){
	/*
	  payload:{
	    fullName: 'Kunal Pal',
        googleAccessToken: '',
        googleUserId: '',
        email: 'xyz@gmail.com',

        googleLogin: true
               or
        facebookLogin: true
	  }
	*/

	// some varaibles
	let dataToSend;
	let updateAccessTokenFlag = 0;
	let found;

	// handling asynchronous functions synchronously
	async.series([
		function(cb){
			let criteria;
			let projection = {};

			/*
			  here we are using function socialSignUp 
			  for both facebook login and google login api
			  so here we are checking whether this request is either from the facebook
			  or google
			*/
			if(payload.googleLogin){
				criteria = {
			    	googleUserId: payload.googleUserId
			    };
			} else {
				criteria = {
					facebookUserId: payload.facebookUserId
				}
			}

			//finding the matching record from DB
			Service.mongoService.find(criteria, projection, function(err, result){
				if(err){
					callback(err)
				} else {
					if(result.length > 0){
						updateAccessTokenFlag = 1;
						found = result[0];
						cb();
					} else {
						cb();
					}
				}
			})
		},
		function(cb){
			/*
			  Here we are updating the accessToken in DB
			  as login successfull means for new request
			  we need new valid token
			*/
			if(updateAccessTokenFlag){
				if(payload.googleLogin){
					found.googleAccessToken = payload.googleAccessToken;
				} else {
					found.facebookAccessToken = payload.facebookAccessToken;
				}
				let query = {
					_id:found._id
				};

				// updating the token in DB
				Service.mongoService.update(query, found, function(err, result){
					if(err){
						callback(err);
					} else {
						if(result){
							dataToSend = {
								message : 'Logged in successfully'
							}
							cb();
						}
					}
				})				
			} else {
				/*
				  if no matching record found
				  then it means user is new
				  create new record
				*/
				Service.mongoService.save(payload, function(err, result){
					if(err){
						callback(err)
					} else {
						console.log(result[0]);
						dataToSend  = {
							message: 'Logged in successfully'
						}
						cb();
					}
				})
			}
		}

	],
	function(err, result){
		callback(null, dataToSend);
	}
	)
}


const CryptData = function (stringToCrypt) {
    return MD5(stringToCrypt);
};


module.exports = {
	signUp,
	socialSignUp
}