DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50),
  department_name VARCHAR(50),
  price INT(50),
  stock_quantity INT(50),
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Softball bat", "Sporting Goods", 300, 10), ("Softball", "Sporting Goods", 5, 100), ("Softball mitt", "Sporting Goods", 100, 20), ("Softball cleats", "Sporting Goods", 50, 20), ("Vacuum", "Home Goods", 150, 10), ("Mop", "Home Goods", 10, 40), ("Mr Clean", "Home Goods", 5, 50), ("Couch", "Furniture", 500, 5), ("Coffee Table", "Furniture", 150, 10), ("End Table", "Furniture", 75, 20);

SELECT * FROM products;