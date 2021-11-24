const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => { 
    Product.findAll()
    .then(products => {
        res.render('./shop/product-list', 
            { 
                products: products,
                pagetitle: 'Product List', 
                path: "/products"         
            });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getProduct = (req, res, next) => {
    Product.findByPk(req.params.productId)
    .then((product) => {
        res.render('./shop/product-details',
        {
            product: product,
            pagetitle: `Product informations: ${product.title}`,
            path: "/products"
        })  
    })
    .catch(err => {
        console.log(err);
    });
    
    //alternative with WHERE condition
    /*Product.findAll({ where: { id: req.params.productId }})
    .then((products) => {
        res.render('./shop/product-details',
        {
            product: products[0],
            pagetitle: `Product informations: ${products[0].title}`,
            path: "/products"
        })  
    })
    .catch(err => {
        console.log(err);
    });*/
}

exports.getIndex = (req, res, next) => {
    Product.findAll()
    .then(products => {
        res.render('./shop/index', 
            { 
                products: products,
                pagetitle: 'Shop', 
                path: "/"         
            });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getCart = (req, res, next) => {
    req.user.getCart()
    .then(cart => {
        return cart.GetProducts()
        .then(products => {
            res.render('./shop/cart', 
                { 
                    pagetitle: "My Cart",
                    path: "/cart",
                    products: products
                });
        })
        .catch(err => {
            console.log(err);
        });
    })    
    .catch(err => {
        console.log(err);
    });
}
   

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id: productId }});
    })
    .then(products => {
        let product;
        if(products.length > 0)
        {
            product = products[0];
        }
        let newQuantity = 1;
        if(product) {
            //...
        }        
        return Product.findByPk(productId)
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity }});
        })
        .catch(err => {
            console.log(err);
        });
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    });

}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });   
}

exports.getOrders = (req, res, next) => {
    res.render('./shop/orders', 
        { 
            pagetitle: "My Orders",
            path: "/orders"
        });
}

exports.getCheckout = (req, res, next) => {
    res.render('./shop/checkout', 
        { 
            pagetitle: "Checkout",
            path: "/checkout"
        });
}