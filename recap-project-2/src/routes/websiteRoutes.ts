import { Router } from "express";
import { listTrails, showTrail } from "../controllers/trailController";

const router = Router()

router.get('/', listTrails)
router.get('/trails/:slug', showTrail)

export default router