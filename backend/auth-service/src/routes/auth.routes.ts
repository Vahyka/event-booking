import express, { Router, RequestHandler } from 'express';


const router: Router = express.Router();

router.post('/register', register as RequestHandler);
router.post('/login', login as RequestHandler);


export default router;
