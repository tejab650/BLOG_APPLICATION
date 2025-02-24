import express from 'express';
import { authenticateToken } from '../Middlewares/verfiyJwtToken.js';
import { addContactController, getAllContacts } from '../Controllers/contact.controller.js';


const router = express.Router();

router.post("/addContact",authenticateToken,addContactController);
router.get("/allContacts",authenticateToken,getAllContacts);

export default router;