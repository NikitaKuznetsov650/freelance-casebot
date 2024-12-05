import { getCoinData, withdraw } from "../controllers/crypto.controller";
import { router } from "./router";

router.post("/withdeaw", withdraw)

export default router;
