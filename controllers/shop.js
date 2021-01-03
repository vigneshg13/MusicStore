const Product = require('../models/product');
const user = require('../models/user');
const Order = require('../models/order');
const stripe = require('stripe')('sk_test_51I55MpBQxPo86Yd81KIIAoOcmAwRajMafUbUGfyK4mWd0Wt6VT94ZjRX7EYIWrhaCYqs2vSVb7bYOFfAibtu3zT900MTFaKsrA');

exports.getProducts = (req,res,next)=>{
    //console.log('From Shop Js',adminData.prodList);
    //res.sendFile(path.join(rootDir,'views','shop.html'));
    const products = Product.find().then(products=>{
        res.render('shop/product-list',{prods:products,docTitle:'Shop',path:'/products'}); //will use the default template enginee.
    }).catch(err => {
        console.log(err);
    });
    
}

exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId;
    Product.findById(prodId).then(product=>{
        console.log(product);
        res.render('shop/product-detail',{product:product,docTitle:product.title,path:'/products'})
    }).catch(err => { 
        console.log(err);
    });   
}

exports.getIndex = (req,res,next) => {
    
    const products = Product.find().then(products=>{
        res.render('shop/index',{prods:products,docTitle:'All Products',path:'/'}); //will use the default template enginee.
    }).catch(err=>{
       console.log(err); 
    });

}

exports.getCart = (req,res,next) => {
    req.user
    .populate('cart.items.productId').
    execPopulate().
    then(user => {
        //console.log(user.cart.items);
        const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        docTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err)); 
}


exports.postCart = (req,res,next) => {
    const productId = req.body.prodId;
    console.log(productId);
    Product.findById(productId).then(Product => {
        return req.user.addToCart(Product).then(result =>{
            console.log(result);
            res.redirect('/cart');
        })

    }).catch(err=>{
        console.log(err);
    });  
    
}

exports.postCartDeleteItems = (req,res,next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    req.user.removeFromCart(prodId).then(result => {
        res.redirect('/cart');
    }).catch(err=> console.log(err));
    // Product.findById(prodId,(product)=>{
    //     console.log(product);
    //     Cart.deleteProduct(prodId,product.price);
    //     res.redirect('/cart');
    // });
}

exports.getOrders = (req,res,next) => {
    Order.find({"user.email":req.user.email}).then(orders =>{
        res.render('shop/Orders',{docTitle:'Orders',path:'/orders',orders:orders,isAuthenticated:req.session.isLoggedIn});
    }).catch(err => {
        console.log(err);
    });
}

exports.postOrders = (req,res,next) => {
    req.user
    .populate('cart.items.productId').
    execPopulate().
    then(user => {
        //console.log(user.cart.items);
        const products = user.cart.items.map(item => {
            return {product:{...item.productId._doc},quantity:item.quantity}
        });
        const order = new Order({
            products:products,
            user:{
                email:req.user.email,
                userId:req.user
            }
        });
        order.save();
    }).then(result => {
        req.user.clearCart()
        .then(() => {
            res.redirect('/orders');
        });
    }).catch(err => {
        console.log(err);
    });
}

exports.getCheckout = (req,res,next) => {
    let products;
    let total=0;

    req.user
    .populate('cart.items.productId').
    execPopulate().
    then(user => {
        //console.log(user.cart.items);
        products = user.cart.items;
        total =0;
        products.forEach(p =>{
            total += p.quantity*p.productId.price;
        } );
        return stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:products.map(p => {
                return {
                name:p.productId.track,
                description:p.productId.description,
                amount:p.productId.price * 100,
                currency:'usd',
                quantity:p.quantity
            };
            }),
            success_url:req.protocol + '://' +req.get('host') +'/checkout/success',
            cancel_url:req.protocol + '://' +req.get('host') +'/checkout/cancel'

        });
    }).then(session => {
        res.render('shop/checkout', {
            path: '/checkout',
            docTitle: 'Checkout',
            products: products,
            totalSum:total,
            sessionId:session.id
          });
    })
    .catch(err => console.log(err));
}