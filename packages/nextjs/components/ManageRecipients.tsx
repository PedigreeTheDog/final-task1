import React, { useState } from "react";
import { Button, Input } from "~~/app/page";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const ManageRecipients = () => {
  const [recipient, setRecipient] = useState("");

  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "BillPayment",
  });

  const handleApprove = async () => {
    if (!recipient) {
      alert("Введите адрес получателя.");
      return;
    }
    try {
      await writeContractAsync({
        functionName: "approveRecipient",
        args: [recipient],
      });
      alert("Получатель успешно одобрен!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при одобрении получателя.");
    }
  };

  const handleRemove = async () => {
    if (!recipient) {
      alert("Введите адрес получателя.");
      return;
    }
    try {
      await writeContractAsync({
        functionName: "removeRecipient",
        args: [recipient],
      });
      alert("Получатель успешно удален!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при удалении получателя.");
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
      <Button onClick={handleApprove} disabled={isMining}>
        {isMining ? "Обработка..." : "Одобрить"}
      </Button>
      <Button onClick={handleRemove} disabled={isMining}>
        {isMining ? "Обработка..." : "Удалить"}
      </Button>
    </div>
  );
};

export default ManageRecipients;
