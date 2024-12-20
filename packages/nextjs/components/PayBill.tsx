import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, Input } from "~~/app/page";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const PayBill = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "BillPayment",
  });

  const handlePayment = async () => {
    if (!ethers.isAddress(recipient)) {
      alert("Введите корректный адрес получателя.");
      return;
    }
    if (!amount || isNaN(parseFloat(amount))) {
      alert("Введите корректную сумму.");
      return;
    }
    try {
      await writeContractAsync({
        functionName: "payBill",
        args: [recipient, amount ? ethers.parseEther(amount) : undefined],
      });
      alert("Оплата успешно выполнена!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при оплате счета.");
    }
  };

  return (
    <div>
      <Input
        type="text"
        placeholder="Адрес получателя"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
        disabled={isMining}
      />
      <Input
        type="text"
        placeholder="Сумма (ETH)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        disabled={isMining}
      />
      <Button onClick={handlePayment} disabled={isMining}>
        {isMining ? "Обработка..." : "Оплатить"}
      </Button>
    </div>
  );
};

export default PayBill;
