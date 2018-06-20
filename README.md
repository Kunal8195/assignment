                            # API DOC #
# To Start the Project
```
   npm install
   npm start
```

For all third party services such as Google, facebook, twilio, jwt and aws-ses we need secret keys and id's which are stored in environment varaibles. so to get this environment file email at kpal9518@gmail.com.
place that .env file in project's folder.

Used JsonWebToken for the detection of login from the multiple devices.
if found a valid Json web token in DB then it means a user has a valid session previously. so will create a new json web token and store in DB to establish a new session.

This project have endpoints provided below. login and signup works good. when you enable double authentication then login will be done through recieving OTP at your mobile number or at your email. but in twilio trial account we cannot send OTP to unregistered mobile number. so you will be able to send OTP to only my number 9041306219. same with case of email. 

Root URL 
Try this endpoint in your browser
``` 
 on server  http://159.65.157.18:3000/ 
 server is running with nohup

 on local  http://localhost:3000/
 ```

# Endpoints for Signup and Login
1.
        /signup
        method: POST
        payload: {
           fullName:'Kunal Pal',
           phoneNo: '9041306219',
           email: 'kpal9518@gmail.com',
           dob: '08/12/1995',
           password: ********
        }

 2. 
        /login
        method: POST
        payload: {
            email:'kpal9518@gmail.com',
            password: ********
        }

# Endpoints for Google/Facebook login
#### Try these endpoints in your Browser
3. 
        /auth/google
        open this endpoint in your browser you will be redirected to the google login page enter the credential and you will be redirected the success login page. But at here you will be redirected to the login page but you won't be redirected to the success login page because my google api app is still in development mode not a published one.

4.
        /auth/facebook
        open this endpoint in your browser you will be redirected to the facebook login page, enter the credential and you will be redirected to the success login page. But at here you will be redirected to the login page but you won't be redirected to the success login page because my facebook graph app is still in development mode not a published one.
       

# Endpoints for verifying the OTP
4. 
        /verifyPhone
        method: POST,
        paylaod: {
            phoneNo: 9041306219,
            otp: ******
        }

5.  
        /verifyEmail
        method: POST
        payload: {
            email: 'kpal9518@gmail.com',
            otp: ******
        }

# Endpoint for Enabling Double Authentication
7.   
        /enableDoubleAuth
        method: POST
        payload: {
            email: 'kpal9518@gmail.com',
            password: ********
        }