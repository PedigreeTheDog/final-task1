import React, { useState } from "react";
import { ethers } from "ethers";
import styled from "styled-components";
import { Button, Input } from "~~/app/page";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const DepositContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const DepositFunds = () => {
  const [amount, setAmount] = useState("");

  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "BillPayment",
  });

  const handleDeposit = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      alert("Введите корректную сумму.");
      return;
    }
    try {
      await writeContractAsync({
        functionName: "deposit",
        value: amount ? ethers.parseEther(amount) : undefined,
      });
      alert("Депозит успешно выполнен!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при депозите средств.");
    }
  };

  return (
    <DepositContainer>
      <Input
        type="text"
        placeholder="Введите сумму (ETH)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        disabled={isMining}
      />
      <Button onClick={handleDeposit} disabled={isMining}>
        {isMining ? "Обработка..." : "Внести депозит"}
      </Button>
    </DepositContainer>
  );
};

export default DepositFunds;
