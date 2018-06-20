/** External Dependencies **/
const validate = require("express-validation");
const validations = require("./validations");
const Controller = require("../Controllers");


module.exports = function(app){
	app.post('/login', validate(validations.loginSchema), (req, res) => {
		// send only the data that is required by the controller
		/* Expecting email and password in req.body
           {
           	  email:'xyz@gmail.com',
           	  password: '123456789'
           }
        */		
		Controller.logInController.logIn(req.body, function(err, result){
			if(err){
				res.status(401).send(err);
			} else {
				res.status(200).send(result);
			}
		})
	});

	app.post('/signup', validate(validations.signupSchema), (req, res) => {
		/* Expecting following payload  in req
			{
			  fullName: 'Kunal Pal',
		      email:'xyz@gmail.com',
		      phoneNo:'9090909090',
		      password:'123456789',
		      dob:'09/09/1996'
			}
		*/
		Controller.signUpController.signUp(req.body, function(err, result){
			if(err){				
				res.status(401).send(err);				
			} else {				
				res.status(200).send(result);
			}
		})

	});

}