exports.getErrorPage = (req,res,next) => {
    //res.status(404).send('<h1>Page Not Found</h1>');
    //res.status(404).sendFile(path.join(__dirname,'views','error.html')); //using HTML file sending to browser
    res.status(404).render('error',{docTitle:'404-Error',path:''}); // rendering the html with PUG template enginee
 }