import { getRef } from '../controllers/ref.controller';
import { router } from './router';

router.post('/getref', getRef);

export default router;
