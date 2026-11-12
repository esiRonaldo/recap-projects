import { Router } from "express";
import { createTrail, editTrailForm, listAdminTrails, newTrailForm, removeTrail, saveTrail } from "../controllers/adminController";


const router = Router()
router.get('/', listAdminTrails)
router.post('/trails/:id/delete', removeTrail)
router.get('/trails/new', newTrailForm)
router.get('/trails/:id/edit', editTrailForm)
router.post('/trails/:id', saveTrail)
router.post('/trails', createTrail)

export default router