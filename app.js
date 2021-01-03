const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const csrf = require('csurf');
const mongoDbStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const multer = require('multer');
const Stripe = require('stripe');

//const mongoConnect = require('./util/database').mongoConnect;
//const rootDir = require('./util/path');
const adminRoute = require('./routes/admin');
const homeRoute = require('./routes/shop');
const authRoute = require('./routes/auth');
const errorController = require('./controllers/error');
const User = require('./models/user');
const app = express();
const MONGODB_URI ='mongodb+srv://appdev:evvyipnX5Ka3EmEm@cluster0.1hwo2.mongodb.net/MusicStore?retryWrites=true&w=majority';
const csrfProtection = csrf();

/*
Use is a function in express JS which is used to create a middleware. 
Middleware are kind of funnel through which the request pass through until we send a response.
It is equivalent to filters in J2ee Where u can add multiple filters for a request and manipulate it.
*/
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

//setting view template enginee.
app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:true}));
app.use(
    multer({storage: fileStorage, fileFilter: fileFilter }).single('image')
  );
app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images')));
const store = new mongoDbStore({
    uri:MONGODB_URI,
    collection:'Session'
});



app.use(session({secret:'my secret Key',resave:false,saveUninitialized:false,store:store}));
app.use(csrfProtection);
app.use(flash());
app.use((req,res,next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id).then(user =>{
        req.user=user
        next();
    }).catch(err => {
        console.log(err);
    })
});

app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken =  req.csrfToken();
    next();
})
app.use('/admin',adminRoute);

app.use(homeRoute);
app.use(authRoute);
app.use(errorController.getErrorPage);

mongoose.connect(MONGODB_URI).then(result => {
    // User.findOne().then(user => {
    //     if(!user){
    //         const user = new User({
    //             name:'Vignesh',
    //             email:'gvignesh13@gmail.com',
    //             cart:{
    //                 items:[]
    //             }
    //         });
    //         user.save();
    //     }
    // }).catch(err => {
    //     console.log(err);
    // });
    app.listen(3000);
}).catch(err => {console.log(err);})

