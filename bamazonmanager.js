var mysql = require("mysql");
var inquirer = require('inquirer');


var connection = mysql.createConnection({
  port: 8889,
  host: "localhost",
  user: "root",
  password: "root",
  database: "bamazon"
});

function choosePath() {
	inquirer.prompt([
	  {
	  	type: 'list',
  		name: 'choose',
  		message: 'Menu Options:',
  		choices: ['View Products for Sale', 'View Low Inventory', "Add to Inventory", "Add New Product"]
	  }
	]).then(function(answers) {
		console.log(answers.choose)
		if (answers.choose === "View Products for Sale") {
			connection.query("SELECT * FROM products", function(err, res) {
    			for (var i = 0; i < res.length; i++) {
    				// console.log(res)
    				console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    			}
    			console.log("-----------------------------------");
  			});
		} else if (answers.choose === "View Low Inventory") {
			connection.query("SELECT * FROM products", function(err, res) {
    			for (var i = 0; i < res.length; i++) {
    				if (res[i].stock_quantity < 5) {
    					console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    				}
    			}
    			console.log("-----------------------------------");
  			});
		} else if (answers.choose === "Add to Inventory") {
			var products = [];
			connection.query("SELECT * FROM products", function(err, res) {
    			for (var i = 0; i < res.length; i++) {
    				products.push(res[i].product_name)
    			}
				inquirer.prompt([
				  {
			    	type: 'list',
			    	name: 'choose',
			    	message: 'What item would you like to post?',
			    	choices: products
				  }, {
			    	type: 'input',
			    	name: 'toAdd',
			    	message: 'What quantity would you like to add to inventory?'
				  }
				]).then(function(answers) {
					console.log("success")
					connection.query("SELECT * FROM products WHERE product_name=?", [answers.choose], function(err, res) {
						console.log(res[0].stock_quantity)
						console.log(answers.toAdd)
						console.log(answers.choose)
						var newStock = parseInt(res[0].stock_quantity) + parseInt(answers.toAdd);
						var query = connection.query(
							"UPDATE products SET ? WHERE ?",
							    [
							      	{
							        	stock_quantity: newStock
							      	},
							      	{
							        	product_name: answers.choose
							      	}
							    ]
						);
	    			});
				})
			});
		} else if (answers.choose === "Add New Product") {
			inquirer.prompt([
			  	{
		    		type: 'input',
		    		name: 'product',
		    		message: 'What product would you like to add?',
			  	}, {
		    		type: 'input',
		    		name: 'department',
		    		message: 'What department would you like to add the item into?',
			  	}, {
			    	type: 'input',
			    	name: 'price',
			    	message: 'What price would you like to set for the item?',
			  	}, {
			    	type: 'input',
			    	name: 'inventory',
			    	message: 'How many units are being added to inventory?'
			  	}
			]).then(function(answers) {
				console.log("success")
				var query = connection.query(
					"INSERT INTO products SET ?",
		    		{
		      			product_name: answers.product,
		      			department_name: answers.department,
		      			price: answers.price,
		      			stock_quantity: answers.inventory
		    		},
    			)
    			console.log(answers.inventory + " units of " + answers.product + " added to the " + answers.department + " successfully.")
			})
		}
	})
}

choosePath()