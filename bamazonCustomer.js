var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Taterbug1!",
  database: "bamazon_db"
});10

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  console.log("Connected as id: " + connection.threadId);
  console.log();
  console.log("Welcome to BAMAZON!");
  console.log();
  start();
});

// function to prompt user what item they would like to order, query database to get items
function start() {
  var itemOrdered;
  var orderQuantity;
  connection.query("SELECT * FROM products", function(err, data) {
    if (err) throw err;
    // console.log('data = ' + JSON.stringify(data));
    inquirer
      .prompt([
        {
          name: "itemOrdered",
          type: "rawlist",
          pageSize: 11,
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < data.length; i++) {
              choiceArray.push(data[i].product_name);
            }
            return choiceArray;
          },
          message: "Enter the ID of the item you want to order.",
        },
        {
          name: "orderQuantity",
          type: "input",
          message: "Order quantity:",
          filter: Number,
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answers) {
        // get the information of the requested item and amount
        // var requestedItem = answers.itemOrdered;
        var requestedItem;
          for (var i = 0; i < data.length; i++) {
            if (data[i].product_name === answers.itemOrdered) {
              requestedItem = data[i];
            }
          }
        // var requestedQuantity = answers.orderQuantity;

        // determine if there is enough inventory
        // connection.query("SELECT * FROM products WHERE product_name = " + requestedItem, function(err, res) {
        //   if (err) throw err;
          
          console.log("Chosen Item: " + answers.itemOrdered);
          console.log("Order Quantity: " + answers.orderQuantity);

          // determine if there are enough in stock
            if (data.stock_quantity <= parseInt(answers.orderQuantity)) {
              // stock level was high enough, so update db, let the user know, and start over
              console.log();
              console.log("SUCCESS!");
              console.log();
              calculateTotal();
            } else {
              // inventory wasn't high enough, start over
              console.log();
              console.log("INSUFFICIENT INVENTORY!");
              console.log();
              whatNext();
            };
          // };
        });
        });
      // });
  };

function calculateTotal() {
  // get total price; purchase quantity * item amount
  var totalPrice = requestedQuantity + requestedItem.price;
  console.log("Your total price is: $" + totalPrice + ". Thank you for using BAMAZON!");
  whatNext();
}

function whatNext() {
  inquirer
    .prompt([
      {
        name: "nextStep",
        type: "confirm",
        message: "Would you like to shop again?"
      },
    ])
  .then(function(chooseNext) {
    // console.log(chooseNext.nextStep);
    if (chooseNext.nextStep === true) {
      start();
    } else {
      console.log();      
      console.log("Goodbye! Thank you for using BAMAZON!");
      connection.end();
    }
  })
}
