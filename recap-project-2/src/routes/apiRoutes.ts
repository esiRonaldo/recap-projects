import { Router } from "express";
import { listApiTrails, showApiTrail, createApiTrail, replaceApiTrail } from "../controllers/apiTrailController";
import { listApiRegions, listApiRegionTrails } from "../controllers/apiRegionController";
import { apiKey } from "../middleware/apiKey";

const router = Router()

router.get('/trails', listApiTrails)
router.get('/trails/:slug', showApiTrail)
router.post('/trails', apiKey, createApiTrail)
router.put('/trails/:id', apiKey, replaceApiTrail)

router.get('/regions', listApiRegions)
router.get('/regions/:slug/trails', listApiRegionTrails)

export default router