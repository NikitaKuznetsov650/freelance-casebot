import { allUsers, userBalance } from "../controllers/users.controller";
import { router } from "./router";

router.get("/users", allUsers)
router.post("/balance", userBalance)

export default router