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
    start();
  });

// function to prompt user what item they would like to order, query database to get items
function start() {
  connection.query("SELECT * FROM products", function(err, data) {
    if (err) throw err;
    console.log("Welcome to BAMAZON!");
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
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "orderQuantity",
          type: "input",
          message: "Order quantity:",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item and amount
        var chosenItem;
        for (var i = 0; i < data.length; i++) {
          if (data[i].product_name === itemOrdered) {
            chosenItem = data[i].product_name;
          }
          console.log("Chosen Item: " + chosenItem);
          console.log("Order Quantity: " + orderQuantity.answer);
          console.log("Stock Quantity: " + chosenItem.stock_quantity)
        }
        // determine if there are enough in stock
        if (chosenItem.stock_quantity <= parseInt(answer.orderQuantity)) {
          // stock level was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: stock_quantity
              },
              {
                id: chosenItem.id
              }
            ],
            function(err) {
              if (err) throw err;
            console.log("SUCCESS!")
            calculateTotal();
            // calculateTotal();
            }
          );
        } else {
          // inventory wasn't high enough, start over
          console.log("INSUFFICIENT INVENTORY!");
          start();
        };
      });    
  });
};

function calculateTotal() {
  // get total price; purchase quantity * item amount
  var totalPrice = orderQuantity + chosenItem.price;
  console.log("Your total price is: $" + totalPrice + ". Thank you for using BAMAZON!");
  console.log()
  // ask if they have another purchase and start over; or thank and end
  console.log()
}
