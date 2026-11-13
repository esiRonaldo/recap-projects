import { Router } from "express";
import { listApiTrails, showApiTrail, createApiTrail, replaceApiTrail, deleteApiTrail } from "../controllers/apiTrailController";
import { listApiRegions, listApiRegionTrails } from "../controllers/apiRegionController";
import { apiKey } from "../middleware/apiKey";
import { rateLimit } from "../middleware/rateLimit";

const router = Router()

router.get('/trails', listApiTrails)
router.get('/trails/:slug', showApiTrail)
router.post('/trails', apiKey, rateLimit, createApiTrail)
router.put('/trails/:id', apiKey, rateLimit, replaceApiTrail)
router.delete('/trails/:id', apiKey, rateLimit, deleteApiTrail)

router.get('/regions', listApiRegions)
router.get('/regions/:slug/trails', listApiRegionTrails)

export default router