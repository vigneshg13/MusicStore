const bcrypt = require('bcryptjs');

const User = require('../models/user');


exports.getLogin = (req, res, next) => {
let message = req.flash('error');
if(message.length > 0){
    message = message[0];
}
else{
    message=null;
}
  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuthenticated: false,
    errorMessage:message
  });
};

exports.getSignUp = (req, res, next) => {
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      docTitle: 'SignUp',
      isAuthenticated: false,
      errorMessage:message
    });
  };

exports.postSignUp = (req, res, next) => {
    // res.render('auth/signup', {
    //   path: '/signup',
    //   docTitle: 'SignUp',
    //   isAuthenticated: false
    // });
    const email = req.body.email;
    const password = req.body.password;
    const confPwd = req.body.confirmPassword;
    const userType = req.body.userType;
    User.findOne({email:email}).then(userDoc => {
        if(userDoc){
            console.log(userDoc)
            req.flash('error','Email already exists! Please signup with different email ID')
            return res.redirect('/signup');
        }
        if(password !== confPwd){
            req.flash('error','password and confirm password doesn\'t match');
            return res.redirect('/signup');
        }
        return bcrypt.hash(password,12).then(
            password=>{
            const user = new User({email:email,password:password,userType:userType,cart:{items:[]}});
            return user.save();
            }
        )
        .then(result => {
             res.redirect('/login');
        }
        );
    }).catch(err => {
        console.log(err);
    });
  };

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email:email}).then(user => {
      if(!user){
          req.flash('error','Invalid emailId or password')
          return res.redirect('/login');
      }
      bcrypt.compare(password,user.password).then(
          doMatch =>{
            if(doMatch){
                req.session.isLoggedIn = true;
                req.session.isAdmin = user.userType === 'admin' ? true : false;
                req.session.user = user;
                return req.session.save((err)=>{
                    console.log(err);
                    res.redirect('/');
                }
              )
            }
            req.flash('error','Invalid emailId or password')
            res.redirect('/login');
          }).catch(err => {
          console.log(err);  
      })
  }).catch(err => {
      console.log(err);
  })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};