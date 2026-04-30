"use client";

import { useState } from "react";
import { createRazorpayOrder, verifyAndUpdateFee } from "@/lib/paymentActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function PaymentButton({ feeId, amount }: { feeId: number; amount: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);

    const orderData = await createRazorpayOrder(amount);
    if (!orderData.success || !orderData.order) {
      toast.error("Could not create Razorpay order.");
      setLoading(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: "School Fees",
      description: "Payment for student fees",
      order_id: orderData.order.id,
      handler: async function (response: any) {
        const verifyRes = await verifyAndUpdateFee(
          feeId,
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature
        );

        if (verifyRes.success) {
          toast.success("Payment Successful!");
          router.refresh();
        } else {
          toast.error("Payment verification failed.");
        }
      },
      theme: { color: "#FAE27C" },
    };

    if (!(window as any).Razorpay) {
      toast.error("Razorpay SDK not loaded");
      setLoading(false);
      return;
    }

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", function(response: any) {
        toast.error("Payment failed!");
    });
    rzp.open();
    setLoading(false);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-lamaSky text-white px-3 py-1 rounded-md hover:brightness-95 disabled:opacity-50"
    >
      {loading ? "..." : "Pay Now"}
    </button>
  );
}
