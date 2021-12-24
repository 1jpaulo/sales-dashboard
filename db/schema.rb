# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_12_23_200427) do

  create_table "sales", force: :cascade do |t|
    t.string "apn_code", null: false
    t.float "rrp", null: false
    t.float "last_price", null: false
    t.string "item_desc", null: false
    t.string "author"
    t.string "prod_category"
    t.integer "stock_on_hand", null: false
    t.date "trans_date", null: false
    t.time "trans_time", null: false
    t.string "trans_doc_number", null: false
    t.string "trans_ref", null: false
    t.integer "trans_qty", null: false
    t.float "trans_total_ex_tax", null: false
    t.float "trans_total_tax", null: false
    t.float "trans_total_discount", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
