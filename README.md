# Sales Dashboard

## Disclaimer
This project has been developed as a test and doesn't represent
a whole functional system.<br><br>

There is no auth middleware or dashboard functions.<br>
The API just provides GET methods for reading and data display,
it does not let you do CRUD operations besides READ.<br><br>

Bootstrap template: This project uses AdminLTE project as 
frontend template, because it wasn't a full functional system
I created some npm scripts to better suit the dependencies.<br><br>

This project uses Rails 7.0 on top of Ruby 3.0.3.<br>
And for the frontend was used node.js 16.13.1 (npm v8.1.2).<br><br>

As a sugestion I recommend using `nvm` for dealing with node versions.<br><br>

## Steps to install project

1. bundle install
1. npm i
1. npm run dev
1. rails db:migrate
1. For database seeding, please do the following on the terminal:

    ```
        $ sqlite3 db/development.sqlite3
        $ sqlite> .mode tabs
        $ sqlite> .import lib/assets/sales_history.tsv sales_temp
        $ sqlite> insert into sales (apn_code,rrp,last_price,item_desc,author,prod_category,stock_on_hand,trans_date,trans_time,trans_doc_number,trans_ref,trans_qty,trans_total_ex_tax,trans_total_tax,trans_total_discount, created_at, updated_at) select *, datetime('now'), datetime('now') from sales_temp;
        $ sqlite> drop table sales_temp;
        $ sqlite> .quit
    ```
1. rake assets:precompile
1. For tests:

    ```
      $ bundle exec rspec
    ```
1. rails server

## TODO
Right now the product table isn't working, only the charts.

