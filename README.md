                                       API DOC
This project have endpoint provided below. login and signup works good. when you enable double authentication then login will be done through recieving OTP at your mobile number or at your email. but in twilio trial account we cannot send OTP to unregistered mobile number. so you will be able to send OTP to only my number 9041306219. same with case of email. 

Root URL 
Try this endpoint in your browser
``` http://localhost:3000/ ```

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
        /doubleAuthEnable
        method: POST
        payload: {
            email: 'kpal9518@gmail.com',
            password: ********
        }