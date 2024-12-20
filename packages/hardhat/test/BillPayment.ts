import { ethers } from "hardhat";

import { expect } from "chai";
import { BillPayment } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("BillPayment", function () {
  let billPayment: BillPayment;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let recipient: HardhatEthersSigner;

  beforeEach(async function () {
    // Деплой контракта перед каждым тестом
    const BillPaymentFactory = await ethers.getContractFactory("BillPayment");
    billPayment = await BillPaymentFactory.deploy();
    await billPayment.waitForDeployment();

    [owner, user1, recipient] = await ethers.getSigners();
  });

  it("Should set the deployer as the owner", async function () {
    expect(await billPayment.owner()).to.equal(owner.address);
  });

  describe("Approve and Remove Recipients", function () {
    it("Should allow the owner to approve a recipient", async function () {
      await billPayment.approveRecipient(recipient.address);
      expect(await billPayment.approvedRecipients(recipient.address)).to.equal(true);
    });

    it("Should emit an event when a recipient is approved", async function () {
      await expect(billPayment.approveRecipient(recipient.address))
        .to.emit(billPayment, "RecipientApproved")
        .withArgs(recipient.address);
    });

    it("Should allow the owner to remove a recipient", async function () {
      await billPayment.approveRecipient(recipient.address);
      await billPayment.removeRecipient(recipient.address);
      expect(await billPayment.approvedRecipients(recipient.address)).to.equal(false);
    });

    it("Should emit an event when a recipient is removed", async function () {
      await billPayment.approveRecipient(recipient.address);
      await expect(billPayment.removeRecipient(recipient.address))
        .to.emit(billPayment, "RecipientRemoved")
        .withArgs(recipient.address);
    });

    it("Should not allow non-owner to approve or remove recipients", async function () {
      await expect(billPayment.connect(user1).approveRecipient(recipient.address)).to.be.revertedWith("Not authorized");
      await expect(billPayment.connect(user1).removeRecipient(recipient.address)).to.be.revertedWith("Not authorized");
    });
  });

  describe("Deposit and Payment", function () {
    it("Should allow users to deposit funds", async function () {
      const depositAmount = ethers.parseEther("1");
      await billPayment.connect(user1).deposit({ value: depositAmount });
      expect(await billPayment.balances(user1.address)).to.equal(depositAmount);
    });

    it("Should allow users to pay approved recipients", async function () {
      const depositAmount = ethers.parseEther("1");
      const paymentAmount = ethers.parseEther("0.5");

      // Депозит средств и одобрение получателя
      await billPayment.connect(user1).deposit({ value: depositAmount });
      await billPayment.approveRecipient(recipient.address);

      // Оплата счёта
      await expect(billPayment.connect(user1).payBill(recipient.address, paymentAmount))
        .to.emit(billPayment, "BillPaid")
        .withArgs(user1.address, recipient.address, paymentAmount);

      // Проверка баланса
      expect(await billPayment.balances(user1.address)).to.equal(paymentAmount);
    });

    it("Should not allow payment to non-approved recipients", async function () {
      const depositAmount = ethers.parseEther("1");
      const paymentAmount = ethers.parseEther("0.5");

      await billPayment.connect(user1).deposit({ value: depositAmount });
      await expect(billPayment.connect(user1).payBill(recipient.address, paymentAmount)).to.be.revertedWith(
        "Recipient not approved",
      );
    });

    it("Should not allow payment if balance is insufficient", async function () {
      const depositAmount = ethers.parseEther("0.2");
      const paymentAmount = ethers.parseEther("0.5");

      await billPayment.connect(user1).deposit({ value: depositAmount });
      await billPayment.approveRecipient(recipient.address);

      await expect(billPayment.connect(user1).payBill(recipient.address, paymentAmount)).to.be.revertedWith(
        "Insufficient balance",
      );
    });
  });

  describe("Balance Checking", function () {
    it("Should return the correct balance for a user", async function () {
      const depositAmount = ethers.parseEther("1");
      await billPayment.connect(user1).deposit({ value: depositAmount });
      expect(await billPayment.connect(user1).getBalance()).to.equal(depositAmount);
    });
  });
});
