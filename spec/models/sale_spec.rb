require 'rails_helper'

# Test suite for Sale model
RSpec.describe Sale, type: :model do

  # Validation tests
  # ensure all needed columns exist before saving
  subject {
    described_class.new(
      apn_code: "9780099539551",
      rrp: 19.99,
      last_price: 10.9,
      item_desc: "THE HARE WITH AMBER EYES",
      # author: "de Waal Edmund",
      # prod_category: "BI",
      stock_on_hand: 0,
      trans_date: "2011-07-03",
      trans_time: "13:36",
      trans_doc_number: "POS:063337",
      trans_ref: "POS:063337",
      trans_qty: 1,
      trans_total_ex_tax: 18.15,
      trans_total_tax: 1.81,
      trans_total_discount: 4.99
    )
  }

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end

  it "is not valid without a apn_code" do
    subject.apn_code = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a rrp" do
    subject.rrp = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a last_price" do
    subject.last_price = nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a item_desc" do
    subject.item_desc = nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a stock_on_hand" do
    subject.stock_on_hand = nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a trans_date" do
    subject.trans_date = nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a trans_time" do
    subject.trans_time = nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a trans_doc_number" do
    subject.trans_doc_number = nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a trans_ref" do
    subject.trans_ref = nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a trans_qty" do
    subject.trans_qty = nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a trans_total_ex_tax" do
    subject.trans_total_ex_tax = nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a trans_total_tax" do
    subject.trans_total_tax = nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a trans_total_discount" do
    subject.trans_total_discount = nil
    expect(subject).to_not be_valid
  end

end
