const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
      return next(); // Người dùng đã đăng nhập, cho phép truy cập
  }
  console.log(`Unauthorized access attempt to ${req.originalUrl} by IP: ${req.ip}`);
  res.redirect('/login'); // Chuyển hướng đến trang đăng nhập
}

// Giả lập dữ liệu của cart (menu)
let cart = [
  { id: 1, name: 'Coca Cola', price: '12000', Image: 'https://cdn.tgdd.vn/Products/Images/2443/87880/bhx/thung-24-lon-nuoc-ngot-coca-cola-320ml-202304131109287672.jpg', type: 'soda' },
  { id: 2, name: 'Coca Cola zero', price: '15000', Image: 'https://img.websosanh.vn/v2/users/root_product/images/nuoc-giai-khat-cocacola-zero-3/lXCbMjJ-S8vX.jpg', type: 'soda' },
  { id: 3, name: 'Pepsi', price: '12000', Image: 'https://thegioidouong.net/wp-content/uploads/2015/03/Pepsi-lon-cao-2.jpg', type: 'soda' },
  { id: 4, name: 'Pepsi zero', price: '15000', Image: 'https://storage.googleapis.com/sc_pcm_product/prod/2024/3/27/56834-8934588662119.jpg', type: 'soda' },
  { id: 5, name: 'Sprite', price: '10000', Image: 'https://i5.walmartimages.com/seo/Coca-Cola-Sprite-Soft-Drink-12-Oz-Can-24-PK_4b6c5e01-1e94-4abb-a41a-8ba23d2c65ab.0e9fe0c63f0259a5813b9d9686269dfc.jpeg', type: 'soda' },
  { id: 6, name: '7 up', price: '11000', Image: 'https://product.hstatic.net/1000288770/product/nuoc_ngot_7_up_vi_chanh_lon_235ml_04dd0bd25acd41a2b267c7e5fee240fe_master.jpg', type: 'soda' },
  { id: 7, name: 'Lays Sour Cream & Onion', price: '20000', Image: 'https://product.hstatic.net/200000261315/product/lay_onion_515b2ffb9f7549eea26323c358185d03_master.png', type: 'snack' },
  { id: 8, name: 'Lays steak', price: '19000', Image: 'https://product.hstatic.net/200000352097/product/-khoai-tay-vi-than-bo-nuong-texas-lays-wavy-goi-56g-202309070944106614_ab65deea772b48319194f378acec4201_1024x1024.jpg', type: 'snack' },
  { id: 9, name: 'Lays cheddar', price: '21000', Image: 'https://lanchi.vn/wp-content/uploads/2021/10/lays-95g-phomai.jpg', type: 'snack' },
  { id: 10, name: 'Oishi spicy shrimp', price: '10000', Image: 'https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8934803012255.jpg.webp', type: 'snack' },
  { id: 11, name: 'Oishi fish crakers', price: '10000', Image: 'https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8934803022810-1.jpg.webp', type: 'snack' },
  { id: 12, name: 'Poca saute diced beef', price: '6000', Image: 'https://product.hstatic.net/200000495609/product/snack-poca-vi-bo-luc-lac-banh-keo-an-vat-imnuts-01_95be3c47eba4431ba8ec5c4b99278c5b_master.jpg', type: 'snack' },
  { id: 13, name: 'Poca squid chili salt', price: '10000', Image: 'https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8936079122256-1.jpg.webp', type: 'snack' },
  { id: 14, name: 'Doritos', price: '54000', Image: 'https://thucphamplaza.com/wp-content/uploads/products_img/snack-doritos.jpg', type: 'snack' },
  { id: 15, name: 'Noodles full topping', price: '30000', Image: 'https://www.circlek.com.vn/wp-content/uploads/2019/05/9.png', type: 'fresh' },
  { id: 16, name: 'GREEN MILK TEA KIT', price: '17000', Image: 'https://www.circlek.com.vn/wp-content/uploads/2016/06/UPDATE_DRINKS_ThaiXanh.png', type: 'fresh' },
];
// Showing productDetails form
router.get("/productDetails", checkAuthentication, function (req, res) {
  Product.find().then((products) => {
    res.render("productDetails", { cart: cart, Product: products });
  });
});

// Showing cart page
router.get("/cart", checkAuthentication, function (req, res) {
  Product.find().then((products) => {
    let totalPrice = products.reduce((acc, item) => {
      return acc + (item.Product_price * item.Product_quantity);
    }, 0);
    res.render("cart", { Products: products, totalPrice: totalPrice });
  });
});



// Showing productDetails form
router.get("/soda", checkAuthentication, function (req, res) {
  Product.find().then((products) => {
    res.render("soda", { cart: cart, Product: products });
  });
});
router.get("/snack", checkAuthentication, function (req, res) {
  Product.find().then((products) => {
    res.render("snack", { cart: cart, Product: products });
  });
});
router.get("/fresh", checkAuthentication, function (req, res) {
  Product.find().then((products) => {
    res.render("fresh", { cart: cart, Product: products });
  });
});
// ad page
router.get("/verysecret", checkAuthentication, function (req, res) {
    Product.find().then((Product) => {
      res.render("verysecret", { cart: cart, Product: Product });
    });
  });

// Add new items to cart
router.post('/cart', (req, res) => {
  const newitems = req.body;
  newitems.id = cart.length + 1;
  cart.push(newitems);
  res.redirect('/verysecret');
});

// Delete items from cart
router.get('/cart/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  cart = cart.filter(cart => cart.id !== itemId);
  res.redirect('/verysecret');
});
// Add items to customer's cart
router.get('/cart_customer/:id', async (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = cart.find(product => product.id === itemId);
  
    if (item) {
      try {
        let existingProduct = await Product.findOne({ Product_name: item.name });
  
        if (existingProduct) {
          await Product.updateOne(
            { _id: existingProduct._id },
            { $inc: { Product_quantity: 1 } }
          );
        } else {
          const newProduct = new Product({
            Product_name: item.name,
            Product_price: item.price,
            Product_quantity: 1
          });
          await newProduct.save();
        }
        res.redirect('/productDetails');
      } catch (error) {
        res.status(500).send('Error adding product: ' + item.name + ' ' + error.message);
      }
    } else {
      res.status(404).send('Product not found in cart ' + itemId);
    }
  });
  
  // Delete all items from customer's cart
  router.get('/cart_customer_deletall', checkAuthentication, async (req, res) => {
    try {
      await Product.deleteMany({});
      console.log('All data in the product collection has been deleted.');
      res.redirect('/cart');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  });
  
  // Delete specific item from customer's cart
  router.get('/cart_customer_delet/:Product_name', async (req, res) => {
    try {
      const product = await Product.findOne({ Product_name: req.params.Product_name });
      if (product.Product_quantity > 1) {
        await Product.updateOne({ Product_name: req.params.Product_name }, { $inc: { Product_quantity: -1 } });
      } else {
        await Product.deleteOne({ Product_name: req.params.Product_name });
      }
      res.redirect('/cart');
    } catch (error) {
      console.error('Error deleting data:', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });
  
  module.exports = router;
