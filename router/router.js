import express from "express";
import multer from "multer";
//middleware
import {
    validateUser,
    validateLogin
} from '../middleware/validateUser.js';
import { protect } from '../middleware/auth.js';

//ai
import { findSimilarProducts } from '../controllers/ai/aiSearch.controller.js';

// Setup multer for image upload
const upload = multer({ dest: "uploads/" });

//authentication
import { LoginUser } from '../controllers/authentication/userLogin.controller.js';
import { 
    userPasswordUpdate,
    verifyOTP,
    userResetPassword
} from '../controllers/authentication/userPassUpdate.controller.js';
import { registerUser } from '../controllers/authentication/userRegistration.controller.js';

//patent
import { applyForPatent } from '../controllers/patent/protectionApplication.controller.js';

//payment
import { applyCoupon } from '../controllers/payment/coupon.controller.js';
import { getPaymentStatus } from '../controllers/payment/payment.controller.js';

//product
import { getCart, addToCart,  } from '../controllers/product/cart.controller.js';
import { getCategories } from '../controllers/product/category.controller.js';
import { getAllProducts, getProductById,  searchProducts, getFilters } from '../controllers/product/product.controller.js';
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/product/wishList.controller.js";

//user
import { UserAddresses, addAddress } from '../controllers/user/address.controller.js';
import { getUserProfile } from '../controllers/user/userProfile.controller.js';


const router = express.Router();


//ai
router.post('/api/visual-search',upload.single("image"), findSimilarProducts)   // fetches similar products

//authentication
router.post('/api/user/register', validateUser, registerUser);           // create new user.
router.post('/api/user/login',validateLogin, LoginUser);                 // login user.
router.post('/api/user/update-pass', userPasswordUpdate);                // verifies user email and send's otp.
router.post('/api/user/verify-otp',verifyOTP)                            // verifies OTP.
router.post('/api/user/reset-password', protect, userResetPassword)      // updates user password.

//patent
router.post('/api/protection/apply',protect, applyForPatent)    // applies for patent and copyrights.
// Admin routes
// router.put("/api/protection/approve/:id", protect, isAdmin, approveApplication);
// router.put("/api/protection/reject/:id", protect, isAdmin, rejectApplication);


//payment
router.get('/api/payment/:orderId',protect, getPaymentStatus)   // payments.
router.post('/api/coupons/apply',protect, applyCoupon)          // apply coupon.

//product
router.get('/api/products',getAllProducts)                     // fetches all the products.
router.get("/api/products/search", searchProducts)             // fetches all the searched products
router.get("/api/products/filters",getFilters )                 // fetches the products based on filters
router.get('/api/products/:id', getProductById)                // fetches specific produt by its ID.
router.get('/api/cart',protect, getCart)                       // fetches products from the cart.
router.post('/api/cart',protect, addToCart )                   // adds products into the cart.
router.get("/", protect, getWishlist);                         // fetches products from the wishlist.
router.post("/", protect, addToWishlist);                      // add products into the wishlist.
router.delete("/:productId", protect, removeFromWishlist);     // delete's the products from the wishlist. 

//user
router.get('/api/user/profile',protect, getUserProfile)   // fetches user profile.
router.get('/api/addresses',protect, UserAddresses)       // fetches user address.
router.post('/api/addresses',protect, addAddress)         // add's user address.



export default router;


