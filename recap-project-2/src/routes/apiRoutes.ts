import { Router } from "express";
import { listApiTrails, showApiTrail } from "../controllers/apiTrailController";
import { listApiRegions, listApiRegionTrails } from "../controllers/apiRegionController";

const router = Router()

router.get('/trails', listApiTrails)
router.get('/trails/:slug', showApiTrail)
router.get('/regions', listApiRegions)
router.get('/regions/:slug/trails', listApiRegionTrails)

export default router