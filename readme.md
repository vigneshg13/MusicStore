The Music Store application is designed based on the following. 
	1.User can search the existing browse the shop and different items and detail without login. 
	2.User need to login to the site for purchasing any music track listed under the 
	3.New User can signup and login with email and password generated. 
	4.While signup, if the userType selected as 'admin', he/she can edit and delete the music items.
	5.If User signup as a default usertype he can surf and purchase any music items that is already existing.
Concepts implemented in the project are 
	1.Express framework for handling the different types of request from browser GET/POST.
	2.MongoDb is used as a backend database and Object Document Mapping tool Mongoose has been used for interacting with the same.
	3.Validation implemented for login screens
	4.EJS used as an template enginee for rendering the views
	5.Authentication and session are handled in MongoDB.
	6.Route Protection without a valid login also implemented.
	7.Password are handled securely as hashed (using bcrypt) and stored in MongoDb
	8.Handled File upload and serve the image file statically from Node server using multer
	9.CSRF security token is added to avoid the CSRF risk
	10.Implemented the payment concept using stripe a third party package. For testing the stripe payment, please see the below link for test card details.
	https://stripe.com/docs/testing
	11. Understanded and implemented the MVC pattern using NodeJs,express framework and Ejs(template engine)

Some Sample Card numbers to proceed with the checkout using Stripe,
NUMBER	BRAND	CVC	DATE
4242424242424242	Visa	Any 3 digits	Any future date
4000056655665556	Visa (debit)	Any 3 digits	Any future date
5555555555554444	Mastercard	Any 3 digits	Any future date
2223003122003222	Mastercard (2-series)	Any 3 digits	Any future date
5200828282828210	Mastercard (debit)	Any 3 digits	Any future date
5105105105105100	Mastercard (prepaid)	Any 3 digits	Any future date


Instruction for testing:

For Using application Please feel free to sign-up as a new user and Login to try the variety of features inside the app.


Instructions for set-up:

For setting up the application, Kindy extract the zip file and open with VS code.
Run the below commands to start the app and make it run locally.
Step 1 - Install all the packages needed for application from package.json
npm install --save
Step 2 - Please run the below command to start the application as we have configured the script in package.json.
npm start