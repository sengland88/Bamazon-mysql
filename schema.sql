drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
	item_id integer(10) not null,
	product_name varchar(30) not null,
    department_name varchar(30) not null,
    price integer(30) not null,
    stock_quantity integer(30) not null,
    primary key (item_id)
);