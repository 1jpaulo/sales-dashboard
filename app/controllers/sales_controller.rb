class SalesController < ApplicationController

  def index
  end

  def month_sales_by_day
    render json: Sale.year(params[:year].to_i).month(params[:month].to_i).daily.count(:trans_total_ex_tax)
  end

  def year_sales_profit_by_month
    render json: Sale.year(params[:year].to_i).monthly.sum(:trans_total_ex_tax)
  end

  def all_years
    render json: Sale.pluck(:trans_date).map { |date| date.year }.uniq
  end

  def all_months
    render json: Sale.year(params[:year].to_i).pluck(:trans_date).map { |date| date.month }.uniq
  end
end
