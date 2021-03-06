'use strict'

/** External Dependencies **/
const Service = require('../Services');
const OTPController = require('./otpController');

/** 3rd Party **/
const async = require('async');
const MD5 = require('md5');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const logIn = function(payload, callback) {
    /*
      payload:{
        email:'xyz@gmail.com',
        password:'*********'
      }
    */

    // this data will be send in callback
    let dataToSend;

    // flag variables for knowing the status of the process
    let successLogin;
    let doubleAuthFlag = false;
    let diffDeviceFlag = false;

    // store the user record if found in DB
    let found;

    /* 
       this will make sure the synchronous execution of 
       the asynchronous functions
    */
    async.series([
        /*
          Here will be finding the matching record
          in DB correspond to given email
        */
            function(cb) {
                let criteria = {
                    email: payload.email
                };

                // in return from the query we need only these field
                let projection = {
                    password: 1,
                    email: 1,
                    phoneNo: 1,
                    doubleAuth: 1,
                    accessToken: 1
                };

                // finding the record in mongoDB
                Service.mongoService.find(criteria, projection, function(err, result) {
                    if (err) {
                        callback(err);
                    } else {

                        // will get executed if any record is found
                        if (result.length > 0) {

                            found = result[0];
                            // accessing the 0th index as an array returned by mongo
                            /* 
                               if accessToken is found then we will verify it 
                               if not found then we will store a new one
                            */
                            let token = jwt.sign({_id:found._id},process.env.jwtSecretKey || 'qwertyuiop12345678',{expiresIn:'1h'})
                            
                            if(found.accessToken){ 
                                
                                jwt.verify(found.accessToken, process.env.jwtSecretKey || 'qwertyuiop12345678', function(err, decoded){
                                    if(err){

                                        // if err occurs means
                                        // we need a new token in DB
                                        found.accessToken = token;
                                        cb();
                                    } else {

                                        /*
                                          if token from DB is valid
                                          then that means a token user has already logged in sometime before
                                          from some other device                                          
                                        */
                                        
                                        diffDeviceFlag = true;
                                        cb();
                                    }
                                })
                            } else {
                                found.accessToken = token;                                
                                cb();
                            }
                                                 
                        } else {

                            /*
                              if no matching record for the email is found
                              that means email is not registered
                            */
                            dataToSend = {
                                message: 'You are not registered'
                            }
                            callback(dataToSend);
                        }
                    }
                })
            },
            function(cb) {

                // will reach here only if matching record is found in the DB
                /*
                  encrypting the password using md5 
                */
                payload.password = MD5(payload.password);

                //will get true only if password is matched
                if (payload.password == found.password) {

                    let query = {
                        _id: found._id
                    };

                    // update the access token in DB
                    Service.mongoService.update(query, found, function(err, result){
                        if(err){
                            callback(err)
                        } else {
                            // success 
                            // do nothing
                        }
                    })

                    /*
                      checking if user has not enabled doubleAuth
                      1. if enable then OTP will get sent to the registered mobile number or email
                      then after verifying OTP login will be successfull
                      2. if disable then login will be successfull
                    */
                    if (found.doubleAuth) {

                        /* 
                           checking if user has mobile number
                           if yes then OTP will be sent to the mobile number
                        */
                        doubleAuthFlag = true;
                        successLogin = true;
                        if (found.phoneNo) {

                            OTPController.sendSmsOTP(found)
                                .then(data => {
                                    dataToSend = {
                                        message: 'You have recieved OTP on your registered phoneNo'
                                    }
                                    callback(null, dataToSend);
                                })
                                .catch(err => {
                                    callback(err)
                                });
                        } else {

                            /*
                              this condition execute if mobile number is not found then
                              OTP will be sent to the registered email
                            */
                            OTPController.sendEmailOTP(found)
                                .then(data => {
                                    dataToSend = {
                                        message: 'You have recieved OTP on your registered mail'
                                    }
                                    callback(null, dataToSend);
                                })
                                .catch(err => {
                                    callback(err)
                                });
                        }

                    } else {
                        successLogin = true;
                        doubleAuthFlag = true;
                        cb();
                    }
                } else {
                    successLogin = false;
                    cb();
                }
            }
        ],
        function(err, result) {
            if (successLogin) {
                if(doubleAuthFlag){
                    if(diffDeviceFlag){
                        dataToSend = {
                            message: 'You are already Logged in from some other device, now your previous session will get expired, Logged in successfully!'
                        }
                        callback(null, dataToSend)
                    } else {
                        dataToSend = {
                            message: 'You have logged in successfully'
                        };
                        callback(null, dataToSend);
                    }
                } else {
                    dataToSend = {
                        message: 'You have logged in successfully'
                    };
                    callback(null, dataToSend);
                }
            } else {
                dataToSend = {
                    message: 'Incorrect Password'
                };
                callback(dataToSend);
            }
        }
    )
}

const doubleAuthEnable = function(payload, callback) {
    /*
      payload:{
        email:'xyz@gmail.com',
        password: '********'
      }
    */

    // some variables
    let found;
    let dataToSend;
    let successLogin;

    async.series([
        /*
          first we are finding whether record exists correspond to that email or not
        */
            function(cb) {
                let criteria = {
                    email: payload.email
                };
                let projection = {
                    password: 1,
                    doubleAuth: 1
                };
                Service.mongoService.find(criteria, projection, function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        if (result.length > 0) {
                            found = result[0];
                            cb();
                        } else {
                            dataToSend = {
                                message: 'You are not registered'
                            }
                            callback(dataToSend);
                        }
                    }
                })
            },
            /*
              if matching record found then we will match the password
            */
            function(cb) {
                payload.password = MD5(payload.password);
                if (payload.password == found.password) {

                    // if password matched then we set the doubleAuth value to true
                    found.doubleAuth = true;
                    let query = {
                        _id: found._id
                    };

                    /*
                      find the matching document
                      and update the document
                    */
                    Service.mongoService.update(query, found, function(err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            if (result) {
                                dataToSend = {
                                    message: 'Logged in successfully and DoubleAuth Enabled'
                                }
                                successLogin = true;
                                cb();
                            }
                        }
                    })
                } else {
                    successLogin = false;
                    cb();
                }
            }

        ],
        function(err, result) {
            if (successLogin) {
                callback(null, dataToSend);
            } else {
                dataToSend = {
                    message: 'Incorrect password'
                }
                callback(dataToSend);
            }
        }
    )
}

module.exports = {
    logIn,
    doubleAuthEnable
}