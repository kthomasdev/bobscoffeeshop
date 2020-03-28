App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('BobsCoffeeshop.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var BobsCoffeeshopArtifact = data;
      App.contracts.BobsCoffeeshop = TruffleContract(BobsCoffeeshopArtifact);

      // Set the provider for our contract.
      App.contracts.BobsCoffeeshop.setProvider(App.web3Provider);

      // set display
      return App.setDisplay();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
  },

  handleTransfer: function(event) {
    event.preventDefault();

    var amount = web3.toWei(parseInt($('#payAmmount').val()));

    var coffeeId = parseInt($('#coffeeId').val());
    var coffeeQty = parseInt($('#CoffeeQuantity').val());

    console.log('Amount: ' + amount);
    console.log('Coffee id: ' + coffeeId);
    console.log('Coffee quantity: ' + coffeeQty);

    var BobsCoffeeshopInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.BobsCoffeeshop.deployed().then(function(instance) {
        BobsCoffeeshopInstance = instance;

        return BobsCoffeeshopInstance.buyCoffee(coffeeId, coffeeQty,{from: account, value: amount});
      }).then(function(result) {
        //alert('Transfer Successful!');
        $('#statusMsg').text("Please collect your coffee").css("color", "green");
        return App.setDisplay();
      }).catch(function(err) {
        $('#statusMsg').text(err).css("color", "red");
        console.log(err.message);
      });
    });
    
  },

  setDisplay: function() {
    console.log('Getting coffee sales...');

    var BobsCoffeeshopInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      // set account address
      var account = accounts[0];
      $('#AccountAddress').text(account);
      // set account balance
      var balance = web3.fromWei(web3.eth.getBalance(account),"ether");
      $('#AccountBalance').text(balance);

      App.contracts.BobsCoffeeshop.deployed().then(function(instance) {
        BobsCoffeeshopInstance = instance;

        return BobsCoffeeshopInstance.getCoffeesSold();
      }).then(function(result) {
        // set the display for coffee sales
        $('#americano').text(result[0].c[0]);
        $('#latte').text(result[1].c[0]);
        $('#cappuccino').text(result[2].c[0]);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
