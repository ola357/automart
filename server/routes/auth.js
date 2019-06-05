import express from 'express';
import AuthControllers from '../controllers/AuthController';

const router = express.Router();

router.post('/signup', AuthControllers.userSignup);

router.post('/signin', AuthControllers.userSignin);
export default router;
