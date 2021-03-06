DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(25) NOT NULL,
  price INT NOT NULL,
  stock_quantity INT,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fluffy Slippers", "Clothing", 23.75, 99);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Calvin and Hobbes Set", "Books", 59.99, 159);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Emerald Earrings", "Jewelry", 599.99, 32);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Opal Necklace", "Jewelry", 899.99, 54);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Jade Scuplture", "Antiques", 13986.99, 8);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Chinese Calligraphy Scroll", "Antiques", 175524.99, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Haunted Doll", "Antiques", 1782.99, 11);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Batman Coloring Book", "Toys and Games", 7.99, 76);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Batman Crayons", "Toys and Games", 5.99, 127);
