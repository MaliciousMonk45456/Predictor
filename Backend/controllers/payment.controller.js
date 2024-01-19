const { ErrorHandler } = require("../util/error");
const Authuser = require("../models/authuser.model");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const mongoose = require("mongoose");
const fs = require("fs");

const dotenv = require("dotenv");
dotenv.config();

const { Resend } = require("resend");

const Razorpay = require("razorpay");
const crypto = require("crypto");

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const create_order = async (req, res, next) => {
  try {
    // const instance = new Razorpay({
    //   key_id: process.env.KEY_ID,
    //   key_secret: process.env.KEY_SECRET,
    // });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
      // receipt: "receipt#1",
    };
    instance.orders.create(options, (error, order) => {
      if (error) {
        // console.log(error);
        throw new ErrorHandler(500, "Something Went Wrong!");
        // return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    // console.log(error);
    // res.status(500).json({ message: "Internal Server Error!" });
    error = new ErrorHandler(500, "Internal Server Error!");
    next(error);
  }
};

const verifyorder = async (req, res, next) => {
  try {
    // console.log(req.userData);
    const { razorpay_orderID, razorpay_paymentID, razorpay_signature } =
      req.body;
    // console.log(req.body);
    const sign = razorpay_orderID + "|" + razorpay_paymentID;
    const resultSign = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature == resultSign) {
      const user = await Authuser.findById(req.userData.userId);
      user.payment = razorpay_paymentID;
      // console.log(razorpay_paymentID);
      const payment = await instance.payments.fetch(razorpay_paymentID);
      // console.log("control" + payment);
      const date = new Date(payment.created_at * 1000);
      // console.log(payment);
      try {
        const doc = new PDFDocument();
        doc.pipe(
          fs.createWriteStream(`/tmp/receipt_${razorpay_paymentID}.pdf`)
        );
        doc
          .fontSize(27)
          .text(
            `Payment receipt from Recommendation System for transaction id ${razorpay_paymentID} for amount ${
              payment.amount / 100
            } for the ${payment.description} issued on ${date}`
          );
        doc.end();
      } catch (err) {
        throw new ErrorHandler(500, "Cannot make Receipt");
      }

      try {
        //   const transporter = nodemailer.createTransport({
        //     // service: "gmail",
        //     port: 465,
        //     host: "smtp.gmail.com",
        //     auth: {
        //       user: process.env.EMAIL,
        //       pass: process.env.PASSWORD,
        //     },
        //     secure: true,
        //   });
        //   const mailOptions = {
        //     from: process.env.EMAIL,
        //     to: payment.email,
        //     subject: "Payment Receipt",
        //     attachments: [
        //       {
        //         filename: `receipt_${razorpay_paymentID}.pdf`,
        //         path: `/tmp/receipt_${razorpay_paymentID}.pdf`,
        //       },
        //     ],
        //     text: "Please find attached, the payment receipt",
        //   };
        //   // console.log(payment)
        //   // transporter.sendMail(mailOptions);

        //   await new Promise((resolve, reject) => {
        //     // send mail
        //     transporter.sendMail(mailOptions, (err, info) => {
        //         if (err) {
        //             console.error(err);
        //             reject(err);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
        const resend = new Resend("re_4wYp4LVa_FnZ7qh62LX7FRgz7W5ueH6zv");

        resend.emails.send({
          from: "onboarding@resend.dev",
          to: "tripathiaryan361@gmail.com",
          subject: "Hello World",
          html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
        });
      } catch (err) {
        throw new ErrorHandler(500, "Cannot send mail");
      }
      try {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
          bucketName: "uploads",
        });
        const readStream = fs.createReadStream(
          `/tmp/receipt_${razorpay_paymentID}.pdf`
        );
        const uploadStream = bucket.openUploadStream(
          `receipt_${razorpay_paymentID}.pdf`
        );
        readStream.pipe(uploadStream);
        user.paymentReciept = uploadStream.id;
        await user.save();
        return res
          .status(200)
          .json({ message: "Payment verified successfully" });
      } catch (err) {
        throw new ErrorHandler(500, "Cannot save Receipt");
      }
    }

    // IF USING RAZORPAY WEBHOOKS

    // const requestedBody = JSON.stringify(req.body);
    // const receivedSignature = req.headers["x-razorpay-signature"];
    // const expectedSignature = crypto
    //   .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    //   .update(requestedBody)
    //   .digest("hex");
    // if (receivedSignature === expectedSignature) {
    //   Storage in MongoDB
    // } else {
    //   res.status(400).json({ message: "Payment verification failed" });
    // }
    else {
      throw new ErrorHandler(400, "Payment verification failed");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const refundorder = async (req, res, next) => {
  try {
    // console.log(req.body);
    instance.payments.refund(req.body.paymentId);
    const user = await Authuser.findById(req.userData.userId);
    user.payment = null;
    await user.save();
    res.status(200).json({ message: "Successfully refunded" });
  } catch (error) {
    console.log(error);
    const err = new ErrorHandler(500, "Cannot Issue Refund");
    next(err);
  }
};

const getreceipt = async (req, res, next) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    const user = await Authuser.findById(req.userData.userId);
    const _id = user.paymentReciept;
    bucket.openDownloadStream(_id).pipe(res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create_order,
  verifyorder,
  refundorder,
  getreceipt,
};
