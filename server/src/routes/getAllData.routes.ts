import { getAllData } from "../controllers/getAllData.controller";
import { router } from "./router";

router.get("/getalldata", getAllData)

export default router;