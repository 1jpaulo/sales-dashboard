class CreateSales < ActiveRecord::Migration[7.0]
  def change
    create_table :sales do |t|
      # products table
      t.string :apn_code, null: false
      t.float :rrp, null: false
      t.float :last_price, null: false
      t.string :item_desc, null: false
      t.string :author, null: true
      t.string :prod_category, null: true
      t.integer :stock_on_hand, null: false

      # transactions table
      t.date :trans_date, null: false
      t.time :trans_time, null: false
      t.string :trans_doc_number, null: false
      t.string :trans_ref, null: false
      t.integer :trans_qty, null: false
      t.float :trans_total_ex_tax, null: false
      t.float :trans_total_tax, null: false
      t.float :trans_total_discount, null:false

      t.timestamps
    end
  end
end
