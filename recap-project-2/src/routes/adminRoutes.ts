import { Router } from "express";
import { listAdminTrails, removeTrail } from "../controllers/adminController";


const router = Router()
router.get('/', listAdminTrails)
router.post('/trails/:id/delete', removeTrail)

export default router