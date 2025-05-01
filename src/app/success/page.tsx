"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaySuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    console.log("🔍 결제 승인 파라미터 확인:");
    console.log("paymentKey:", paymentKey);
    console.log("orderId:", orderId);
    console.log("amount:", amount);

    if (!paymentKey || !orderId || !amount) {
      console.error("❌ 필수 파라미터 누락");
      setStatus("error");
      return;
    }

    const confirm = async () => {
      const payload = {
        paymentKey,
        orderId,
        orderName: "티켓 예매",
        amount: parseInt(amount),
      };

      console.log("📦 서버로 전송할 confirm payload:", payload);

      try {
        const res = await fetch(
          "http://localhost:9000/api/v1/purchase/confirm",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
          }
        );

        if (res.ok) {
          console.log("✅ 결제 승인 성공");
          setStatus("success");
        } else {
          const text = await res.text();
          console.error("❌ 결제 승인 실패:", text);
          setStatus("error");
        }
      } catch (e) {
        console.error("🚨 결제 승인 중 오류 발생", e);
        setStatus("error");
      }
    };

    confirm();
  }, [searchParams]);

  return (
    <div className="max-w-lg mx-auto mt-12 p-4 border rounded text-center">
      {status === "loading" && (
        <p className="text-gray-600">결제 승인 처리 중...</p>
      )}
      {status === "success" && (
        <>
          <h1 className="text-xl font-bold mb-2">결제가 완료되었습니다 🎉</h1>
          <p>티켓이 정상적으로 발급되었습니다.</p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-xl font-bold mb-2 text-red-600">
            결제 승인 실패
          </h1>
          <p>결제 처리가 정상적으로 완료되지 않았습니다.</p>
        </>
      )}
    </div>
  );
}
