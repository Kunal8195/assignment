/** External Dependencies **/
const NotificationController = require("./notificationController");
const Service = require("../Services");


const sendEmailOTP = function(payload) {
  /* 
      payload: {
        email:'xyz@gmail.com',
      }
  */  
  return new Promise((resolve, reject) => {
    // generating OTP as a six digit random number
    let otp = Math.floor(100000 + Math.random() * 900000);

    // this data will get save in DB as Record for OTP
    const dataToSave = {
      email: payload.email,
      otp: otp
    };

    // this is the message which will be sent to the registered email
    const messageToSend = {
      email: payload.email,
      type: "OTP",
      message: `Your Secret OTP is ${otp}.`
    };

    /*
      Handling Promise here
      because AWS-SES returns promise
    */
    NotificationController.sendEmail(messageToSend)
      // if success
      .then(() => {

        /*
          if promise get resolved
          we are saving the OTP record in DB
        */
        Service.mongoService.saveOTP(dataToSave, (err, savedOTP) => {
          if (err) {
            reject(err);
          } else {
            resolve(savedOTP);
          }
        });
      })
      // error occurs
      .catch(err => {
        reject(err);
      });
  });
};

const verifyEmailOTP = function(payload) {
  /* 
      payload: {
        email:'xyz@gmail.com',
        otp:123456
      }
  */ 
  return new Promise((resolve, reject) => {

    // criteria for finding the document in MongoDB
    const criteria = {
      email: payload.email,
      otp: payload.otp
    };

    // projection and options left blank as we don't really need here
    const projection = {};
    const option = {};

    /* 
      retrieving the OTP Record from DB 
      correspond to the given email
      if OTP is valid then Document search will be successfull
      otherwise no record will be found
    */
    Service.mongoService.getOTP(criteria, projection, option, (err, data) => {
      if (err) {
        reject(err);
      } else {

        // will get true when no matching record is found
        if (!data.length) {
          reject("OTP not valid !!");
        } else {
          const OTP = data && data[0];
          const currentTime = new Date();

          /*
            OTP is valid only for 5 minutes
            this condition is checking the validity of the OTP
          */
          if (Math.abs(currentTime - OTP.createdAt) < 300000) {
            resolve(data);
          } else {
            reject("OTP Expired");
          }
        }
      }
    });
  });
};

const sendSmsOTP = function(payload) {
  /*
    payload:{
      phoneNo: 9041306219  
    }
  */
  return new Promise((resolve, reject) => {

    // generating OTP as a six digit random number
    let otp = Math.floor(100000 + Math.random() * 900000);

    // this data will get save in DB as Record for OTP
    const dataToSave = {
      phoneNo: payload.phoneNo,
      otp: otp
    };

    // this is the message which will be sent to the registered email
    const messageToSend = {
      phoneNo: payload.phoneNo,
      message: `Your Secret OTP is ${otp}.`
    };

    /*
      Handling Promise here
      because Twilio returns promise
    */
    NotificationController.sendSMS(messageToSend)
      // if success
      .then(() => {
        Service.mongoService.saveOTP(dataToSave, (err, savedOTP) => {
          if (err) {
            reject(err);
          } else {
            resolve(savedOTP);
          }
        });
      })
      // if error occurs
      .catch(err => {
        reject(err);
      });
  });
};

const verifySmsOTP = function(payload) {
  /* 
      payload: {
        phoneNo:9041306219,
        otp:123456
      }
  */
  return new Promise((resolve, reject) => {

    // criteria for finding the document in MongoDB
    const criteria = {
      phoneNo: payload.phoneNo,
      otp: payload.otp
    };

    // projection and options left blank as we don't really need here
    const projection = {};
    const option = {};

    /* 
      retrieving the OTP Record from DB 
      correspond to the given phone number
      if OTP is valid then Document search will be successfull
      otherwise no record will be found
    */
    Service.mongoService.getOTP(criteria, projection, option, (err, data) => {
      if (err) {
        reject(err);
      } else {

        // will get true when no matching record is found
        if (!data.length) {
          reject("OTP not valid !!");
        } else {
          const OTP = data && data[0];
          const currentTime = new Date();

          /*
            OTP is valid only for 5 minutes
            this condition is checking the validity of the OTP
          */
          if (Math.abs(currentTime - OTP.createdAt) < 300000) {
            resolve(data);
          } else {
            reject("OTP Expired");
          }
        }
      }
    });
  });
};

module.exports = {
  sendEmailOTP,
  verifyEmailOTP,
  sendSmsOTP,
  verifySmsOTP
};
