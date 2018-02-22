var mysql = require("mysql");
var inquirer = require('inquirer');


var connection = mysql.createConnection({
  port: 8889,
  host: "localhost",
  user: "root",
  password: "root",
  database: "bamazon"
});

console.log("connected!");

function displayProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
    	// console.log(res)
    	console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
    placeOrder()
  });
  
}

displayProducts()

function placeOrder() {
	inquirer.prompt([
	  {
	  	type: 'input',
  		name: 'item',
  		message: 'Please enter the item ID of the product you would like to purchase.'
	  }, {
	  	type: 'input',
  		name: 'quantity',
  		message: 'Please enter the quantity of the selected product that you would like to purchase.'
	  }
	  ]).then(function(answers) {
			console.log("success")
			connection.query("SELECT * FROM products WHERE id=?", [answers.item], function(err, res) {
				var newStock = parseInt(res[0].stock_quantity) - parseInt(answers.quantity)
				if (res[0].stock_quantity >= answers.quantity) {
					var query = connection.query(
					    "UPDATE products SET ? WHERE ?",
					    [
					      {
					        stock_quantity: newStock
					      },
					      {
					        id: answers.item
					      }
					    ],
					);

					console.log("Your order has been placed. Your total for: " + answers.quantity + " " + res[0].product_name + " is: $" + answers.quantity * res[0].price + ".")
				} else {
					console.log("Insufficient stock to fill your order!")
				}
			});
		})
}





// 	  ]).then(function(answers) {
// 	  	console.log("success")
// 			var query = connection.query(
// 				"UPDATE products SET ? WHERE ?",
// 				    [
// 				      {
// 				        stock_quantity: += answers.quantity
// 				      },
// 				      {
// 				        id: answers.item
// 				      }
// 				    ],

// 			)
// 		})
// }