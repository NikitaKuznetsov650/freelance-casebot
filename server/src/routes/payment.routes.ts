import {createRubPayment, getPayment, rubPayout } from '../controllers/payment.controller';
import { createStripeCheckoutSession, createStripePayoutSession, getStripePayouts, updateStripeCheckoutSession, updateStripePaymentStatus } from '../controllers/stripe.payment.controller';
import { router } from './router';

router.post("/createstripepayment", createStripeCheckoutSession)
router.post("/createstripepayout", createStripePayoutSession)
router.post("/updatestripepaymentstatus", updateStripePaymentStatus)
router.get("/getstripepayoutes", getStripePayouts)
router.post("/createrubpayment", createRubPayment)
router.post("/capturerubpayment", getPayment)
router.post("/rubpayouts", rubPayout)
router.post("/updatestripepayment", updateStripeCheckoutSession)

export default router;
