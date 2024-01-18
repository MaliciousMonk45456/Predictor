const express = require("express");
const {
  create_order,
  verifyorder,
  refundorder,
  getreceipt,
} = require("../controllers/payment.controller");
const { checkAuthpayment } = require("../middleware/checkauth.middleware");

const router = express.Router();

router.use(checkAuthpayment);

router.post("/create", create_order);

router.post("/verify", verifyorder);

router.post("/refund", refundorder);

module.exports = router;
