import express from 'express';
import ProductsController from './src/controllers/product.controller.js';
import ejsLayouts from 'express-ejs-layouts';
import path from 'path';
import validationMiddleware from './src/middleware/validation.middleware.js';
import  {uploadFile}  from './src/middleware/file-upload-middleware.js';
import UserController from './src/controllers/user.controller.js';
import session from 'express-session';
import {auth} from './src/middleware/auth.middleware.js'
import cookieParser from 'cookie-parser';
import { setLastVisit } from './src/middleware/lastvisit.middleware.js';
const app = express();
app.use(cookieParser());
app.use(setLastVisit);
app.use(session({
  secret:'secretKey',
  resave:false,
  saveUninitialized:true,
  cookie:{secure:false}
}))
app.use(express.static('public'));

const productsController =
  new ProductsController();

const userController =
  new UserController();

app.use(ejsLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set(
  'views',
  path.join(path.resolve(), 'src', 'views')
);



app.get('/register',userController.getRegister);
app.get('/login',userController.getLogIn);
app.post('/login',userController.postLogIn);
app.post('/register',userController.postRegister);
app.get('/logout',userController.logout);



app.get('/',auth, productsController.getProducts);
app.get(
  '/add-product',auth,
  productsController.getAddProduct
);

app.get(
  '/update-product/:id',auth,
  productsController.getUpdateProductView
);

app.post(
  '/delete-product/:id',auth,
  productsController.deleteProduct
);

app.post(
  '/',
  uploadFile.single('imageUrl'),auth,
  validationMiddleware,
  productsController.postAddProduct
);

app.post(
  '/update-product',auth,
  productsController.postUpdateProduct
);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
