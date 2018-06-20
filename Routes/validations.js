/** 3rd Party **/
const Joi = require("joi");

// Schema for validation of parameters in login
const loginSchema = {
  body: {
    email: Joi.string().required(),
    password: Joi.string().required()
  }
};

// Schema for validation of parameters in signup
const signupSchema = {
	body:{
		fullName: Joi.string().required(),
		phoneNo: Joi.string().required(),
		email: Joi.string().required(),
		dob: Joi.string().required(),
		password: Joi.string().required(),
		//double auth will act as enable/disable feature
		doubleAuth: Joi.boolean()
	}
}

// Schema for validation of parameters in verify phone number api
const verifyOtpPostSchema = {
	body: {
		otp:Joi.string().required(),
		phoneNo: Joi.string().required()
	}
}

// Schema for validation of parameters in verify email api
const verifyEmailPostSchema = {
	body: {
		email: Joi.string().email().required(),
		otp: Joi.string().required()
	}
}

module.exports = {
	loginSchema,
	signupSchema,
	verifyOtpPostSchema,
	verifyEmailPostSchema
}