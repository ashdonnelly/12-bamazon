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
    console.log("bamazon_db connected");
    start();
  });

// function to prompt user what item they would like to order, query database to get items
function start() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "itemOrdered",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
          message: "Enter the ID number of the item you would like to order."
        },
        {
          name: "orderQuantity",
          type: "input",
          message: "How many would you like to order?",
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
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.itemOrdered) {
            chosenItem = results[i];
          }
        }
        // determine if there are enough in stock
        if (chosenItem.stock_quantity <= parseInt(start.orderQuantity)) {
          // stock level was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: purchaseQuantity
              },
              {
                id: chosenItem.id
              }
            ],
            function(err) {
              if (err) throw err;
              console.log("Your order is waiting for payment.")
              // console.log("You will receive " + amt + item + "(s).")
              // calculateTotal();
            }
          );
        } else {
          // inventory wasn't high enough, start over
          console.log("INSUFFICIENT INVENTORY! Please start over.");
          start();
        };
      });    
  });
};

function calculateTotal() {
  // get total price; purchase quantity * item amount

  // ask if they have another purchase and start over; or thank and end
}
