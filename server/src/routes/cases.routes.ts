import { openCase, getCases, getCasesAmount } from "../controllers/cases.controller";
import { router } from "./router";

router.get("/getcasesamount", getCasesAmount)
router.post("/getcase", getCases)
router.post("/opencase", openCase)

export default router