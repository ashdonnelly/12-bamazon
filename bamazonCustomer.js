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
    inquirer
      .prompt([
        {
          name: "itemOrdered",
          type: "rawlist",
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
      .then(function(userInput) {
        // get the information of the requested item and amount
        var requestedItem = userInput.itemOrdered;
        var requestedQuantity = userInput.orderQuantity;

        connection.query("SELECT * FROM products", {itemOrdered: userInput}, function(err, data) {
          if (err) throw err;
          
          console.log("Chosen Item: " + requestedItem);
          console.log("Order Quantity: " + requestedQuantity);
          console.log("Stock Quantity: " + requestedItem.stock_quantity)
          // determine if there are enough in stock
          if (requestedItem.stock_quantity <= parseInt(userInput.orderQuantity)) {
            // stock level was high enough, so update db, let the user know, and start over
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: stock_quantity
                },
                {
                  id: requestedItem.id
                }
              ],
              function(err) {
                if (err) throw err;
                console.log();
                console.log("SUCCESS!")
                console.log();
                calculateTotal();
              }
            );
          } else {
            // inventory wasn't high enough, start over
            console.log();
            console.log("INSUFFICIENT INVENTORY!");
            console.log();
            start();
          };
        });
      });    
  });
};

function calculateTotal() {
  // get total price; purchase quantity * item amount
  var totalPrice = orderQuantity + requestedItem.price;
  console.log("Your total price is: $" + totalPrice + ". Thank you for using BAMAZON!");
  console.log()
  // ask if they have another purchase and start over; or thank and end
  console.log()
}
