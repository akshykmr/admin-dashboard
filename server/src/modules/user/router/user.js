import {Router} from 'express';
import UserServices from '../services/user';
const { verifyToken } = require('../services/verifyauth');



const router = Router()
 
router.post('/register',  UserServices.addUser)
router.post('/logIn', UserServices.logInUser)
router.get('/protected', verifyToken,  UserServices.logInUserwithToken)


export default router






