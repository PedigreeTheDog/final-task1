"use client";

import styled from "styled-components";
import DepositFunds from "~~/components/DepositFunds";
import ManageRecipients from "~~/components/ManageRecipients";
import PayBill from "~~/components/PayBill";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1e3a5f; /* Темно-синий фон */
  color: #ffffff;
  min-height: 100vh;
  padding: 20px;
`;

const Header = styled.header`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #00bcd4; /* Голубой акцент */
`;

const Card = styled.div`
  background-color: #2a4b77; /* Более светлый синий */
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #00bcd4;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%;
  font-size: 1rem;
  background-color: #1e3a5f;
  color: #ffffff;
`;

const Button = styled.button`
  background-color: #00bcd4;
  border: none;
  border-radius: 5px;
  color: #ffffff;
  padding: 10px 20px;
  font-size: 1rem;
  margin-top: 10px;
  margin-right: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #008c9e;
  }

  &:disabled {
    background-color: #555555;
    cursor: not-allowed;
  }
`;

export { Input, Button };

export default function Home() {
  return (
    <Container>
      <Header>Bill Payment DApp</Header>
      <Card>
        <h3>Пополнение баланса</h3>
        <DepositFunds />
      </Card>
      <Card>
        <h3>Оплата счета</h3>
        <PayBill />
      </Card>
      <Card>
        <h3>Управление получателями</h3>
        <ManageRecipients />
      </Card>
    </Container>
  );
}
