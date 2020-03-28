pragma solidity ^0.5.0;

contract BobsCoffeeshop{
    address payable public owner;
    uint[3] public coffeesSold;
    uint[3] coffeePrice;
    mapping (address => uint) public customers;
    
    constructor() public payable {
        owner = msg.sender;
        coffeePrice = [1 ether, 2 ether, 3 ether]; // IDs [0]: americano, [1]: latte, [2]: cappuccino
    }
    
    function buyCoffee(uint coffeeId, uint quantity) public payable {
        // quantity not zero
        require(quantity > 0, "need to buy at least one coffee");
        // unknown coffee (other than americano, latte and cappuccino)
        require(coffeeId < 3, "we don't sell this coffee");
        // calculate amount to pay
        uint amountToPay = coffeePrice[coffeeId] * quantity;
        // check underpayment
        require(msg.value >= amountToPay, "paid less - you get no coffee");
        // refund overpayment
        if(msg.value > amountToPay){
            uint change = msg.value - amountToPay;
            msg.sender.transfer(change);
        }
        customers[msg.sender] += quantity; // customer gets the coffee
        coffeesSold[coffeeId] += quantity; // keep track of sales
    }

    function getCoffeesSold() public view returns(uint[3] memory){
        return coffeesSold;
    }

    function getCoffeesPrice() public view returns(uint[3] memory){
        return coffeePrice;
    }
}