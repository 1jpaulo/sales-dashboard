class Sale < ApplicationRecord

  # extract only sales from given year
  scope :year, -> (year) {
    year = Date.new(year)
    where(trans_date: year.beginning_of_year..year.end_of_year)
  }
  # extract only sales from given month
  scope :month, -> (month) { where('strftime("%m", trans_date) = ?', month.to_s.rjust(2, '0')) }
  # arrange in groups of months
  scope :monthly, -> { group('strftime("%m", trans_date)')}
  # arrange in groups of days
  scope :daily, -> { group('strftime("%d", trans_date)')}

  validates_presence_of :apn_code, :rrp, :last_price, :item_desc, :stock_on_hand,
  :trans_date, :trans_time, :trans_doc_number, :trans_ref, :trans_qty, :trans_total_ex_tax,
  :trans_total_tax, :trans_total_discount
end
