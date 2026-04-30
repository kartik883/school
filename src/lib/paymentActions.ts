"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import prisma from "./prisma";

export const createRazorpayOrder = async (amountInINR: number) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_SECRET!,
    });

    const options = {
      amount: amountInINR * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await instance.orders.create(options);
    return { success: true, order };
  } catch (err) {
    console.error("Razorpay Create Order Error:", err);
    return { success: false, error: "Failed to create Razorpay order." };
  }
};

export const verifyAndUpdateFee = async (
  feeId: number,
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) => {
  try {
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      const fee = await prisma.fee.findUnique({ where: { id: feeId } });
      if (!fee) return { success: false, error: "Fee not found" };

      // Update as PAID (or partial, but for simplicity assuming full remaining is paid)
      await prisma.fee.update({
        where: { id: feeId },
        data: {
          amountPaid: fee.amount, // Paid in full
          status: "PAID",
          razorpayOrderId: razorpay_order_id,
        },
      });

      return { success: true };
    } else {
      return { success: false, error: "Invalid signature" };
    }
  } catch (err) {
    console.error("Razorpay Verify Error:", err);
    return { success: false, error: "Internal Error" };
  }
};
