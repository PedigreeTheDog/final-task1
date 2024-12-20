// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title BillPayment
/// @dev Контракт для оплаты счетов с функцией управления одобренными получателями.
contract BillPayment {
    string public greeting = "This is the greeting!";

    // Адрес владельца контракта (администратора)
    address public owner;

    // Балансы пользователей (адрес => сумма)
    mapping(address => uint256) public balances;

    // Одобренные получатели, которым можно переводить средства
    mapping(address => bool) public approvedRecipients;

    // Событие, которое срабатывает при успешной оплате счета
    event BillPaid(address indexed payer, address indexed recipient, uint256 amount);

    // Событие, которое срабатывает при добавлении нового одобренного получателя
    event RecipientApproved(address indexed recipient);

    // Событие, которое срабатывает при удалении одобренного получателя
    event RecipientRemoved(address indexed recipient);

    /// @dev Модификатор, разрешающий выполнение функции только владельцу контракта
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized"); // Проверка: вызов функции доступен только владельцу
        _;
    }

    /// @dev Конструктор, задающий владельца контракта при его создании
    constructor() {
        owner = msg.sender; // Устанавливаем владельца как адрес, который развернул контракт
    }

    /// @notice Добавление нового одобренного получателя
    /// @param recipient Адрес получателя, который будет одобрен
    function approveRecipient(address recipient) external onlyOwner {
        approvedRecipients[recipient] = true; // Устанавливаем статус одобрения для указанного адреса
        emit RecipientApproved(recipient); // Сохраняем событие
    }

    /// @notice Удаление одобренного получателя
    /// @param recipient Адрес получателя, который будет удален из списка одобренных
    function removeRecipient(address recipient) external onlyOwner {
        approvedRecipients[recipient] = false; // Удаляем статус одобрения
        emit RecipientRemoved(recipient); // Сохраняем событие
    }

    /// @notice Пополнение баланса пользователя
    /// @dev Сумма отправляется вместе с вызовом этой функции (msg.value)
    function deposit() external payable {
        balances[msg.sender] += msg.value; // Увеличиваем баланс отправителя на отправленную сумму
    }

    /// @notice Оплата счета одобренному получателю
    /// @param recipient Адрес получателя, которому будет переведена сумма
    /// @param amount Сумма, которая будет переведена
    function payBill(address recipient, uint256 amount) external {
        require(approvedRecipients[recipient], "Recipient not approved"); // Проверка: получатель должен быть одобрен
        require(balances[msg.sender] >= amount, "Insufficient balance"); // Проверка: у отправителя достаточно средств

        balances[msg.sender] -= amount; // Уменьшаем баланс отправителя
        payable(recipient).transfer(amount); // Переводим сумму получателю

        emit BillPaid(msg.sender, recipient, amount); // Сохраняем событие
    }

    /// @notice Получение текущего баланса вызывающего адреса
    /// @return Текущий баланс пользователя
    function getBalance() external view returns (uint256) {
        return balances[msg.sender]; // Возвращаем баланс вызывающего адреса
    }
}
