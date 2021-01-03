exports.isAdmin = (req,res,next) =>{
    if(!req.session.isAdmin){
        res.render('error',{docTitle:'Not Authorized'});
    }
    next();
}