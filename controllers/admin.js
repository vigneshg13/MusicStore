const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getAddProduct = (req,res,next)=>{
    //res.send('<html><h2>Add Product</h2><form action="/admin/add-product" method="POST"><input type="text" name="title"/><button type="submit">Add</button></form></html>')
    //res.sendFile(path.join(rootDir,'views','add-product.html'));
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0];
    }
    else{
        message = null;
    }
    res.render('admin/add-product',{docTitle:'Add Products',path:'/admin/add-product',editing:false,errorMessage:message,isAdmin:req.session.isAdmin});
    //next() //its a function which will allow the request to another middleware.
 
 }

 exports.postAddProduct = (req,res,next) =>{
    //console.log(req.body);
    const track= req.body.track;
    const image= req.file;
    const artist = req.body.artist;
    const album = req.body.album;
    const description= req.body.description;
    const price= req.body.price;
    console.log(image); 
    if(!image){
        return res.status(422).render('admin/add-product',{docTitle:'Add Product',
        path:'admin/add-product',
        editing:false,
        product:{
              track:track,
              artist:artist,
              album:album,
              price:price,
              description:description  
        },
        errorMessage:"Attached file is not an image and supports png/jpeg/jpg",
        isAdmin:req.session.isAdmin
    })
    }
    const imageUrl = image.path;

    const product = new Product({
        track:track,
        artist:artist,
        album:album,
        price:price,
        description:description,
        imageUrl:imageUrl,
        userId:req.user._id
    });
    product.save().then(
        result => {
            console.log('Music added !!');
            res.redirect('/');
        }
    ).catch(err =>{
        console.log(err);
    })
    //products.push({"title":req.body.title});
}

exports.getEditProduct = (req,res,next) => {
    const editMode = (req.query.edit === "true") ? true : false;
    if(editMode){
        const prodId = req.params.productId;
        Product.findById(prodId).then(product=>{
            console.log(product.price); 
            res.render('admin/add-product',
            {docTitle:'Edit Product',
            product:product,
            path:'admin/edit-product',
            editing:editMode,
            errorMessage:null,
            isAdmin:req.session.isAdmin
        });
        }).catch(err => {
            console.log(err);
        });
    }
}

exports.postEditProduct = (req,res,next) => {
    const id = req.body.prodId;
    const title= req.body.title;
    const image= req.file;
    const description= req.body.description;
    const price= req.body.price; 
    Product.findById(id).then(product =>{
        product.title=title;
        product.price=price;
        product.description=description;
        if(image){
            product.imageUrl=image.path;
        }
        
        return product.save();
    }).then(result => {
        res.redirect('/admin/products');
    }) 
    
    
    //res.render('admin/add-product',{docTitle:'Edit Product',product:product,path:'admin/edit-product',editing:true,successMsg:true})   
}

exports.postDeleteProduct= (req,res,next) => {
    const prodId = req.body.productId;
    Product.findByIdAndDelete(prodId).then(result => {
        console.log(result);
        res.redirect('/admin/products');
    }).catch(err =>{
        console.log(err);
    });
}

exports.getProducts = (req,res,next)=>{
    //res.send('<html><h2>Add Product</h2><form action="/admin/add-product" method="POST"><input type="text" name="title"/><button type="submit">Add</button></form></html>')
    //res.sendFile(path.join(rootDir,'views','add-product.html'));
    const products = Product.find().
    //select('title price userId -_id').
    //populate('userId').
    then(Products =>{
        console.log(Products);
        res.render('admin/products',{prods:Products,docTitle:'Products',path:'/admin/products',isAdmin:req.session.isAdmin});

    }).catch(err => {
        console.log(err);
    });
        //next() //its a function which will allow the request to another middleware.
 
 }