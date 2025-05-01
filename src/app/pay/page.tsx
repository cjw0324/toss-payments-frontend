"use client";

import { useState } from "react";

export default function PayPage() {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:9000/api/v1/purchase/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ eventId: 2, amount: 50000 }),
      });

      const { data } = await res.json();
      const paymentUUID = data.paymentUUID;

      const tossPayments = await import("@tosspayments/tosspayments-sdk").then(
        (mod) => mod.loadTossPayments("test_ck_Z61JOxRQVEY6lZeGL4zgVW0X9bAq")
      );

      const payment = tossPayments.payment({
        customerKey: "tvivarepublica",
      });

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: 500 },
        orderId: paymentUUID,
        orderName: "예매 티켓",
        successUrl: `${window.location.origin}/success?paymentUUID=${paymentUUID}`,
        failUrl: `${window.location.origin}/pay/fail`,
        customerName: "홍길동",
        customerEmail: "hong@example.com",
        customerMobilePhone: "01012345678",
      });
    } catch (err) {
      console.error("결제 실패", err);
      alert("결제를 시작할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-4 border rounded">
      <h1 className="text-2xl font-bold mb-4">공연 예매</h1>
      <button
        onClick={handlePay}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "결제 준비 중..." : "결제하기"}
      </button>
    </div>
  );
}
