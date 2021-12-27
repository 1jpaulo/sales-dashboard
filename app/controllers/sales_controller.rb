class SalesController < ApplicationController

  def index
  end

  def month_sales_profit

    year_one = params[:year_one].to_i
    year_two = params[:year_two].to_i
    month = params[:month].to_i

    unless year_one == year_two - 1

      render json: {errors: "Years are not consecutive."}, status: :bad_request

    else

      first_year_profit = Sale.year(year_one).month(month).sum(:trans_total_ex_tax)
      second_year_profit = Sale.year(year_two).month(month).sum(:trans_total_ex_tax)

      render json: {year_one: first_year_profit, year_two: second_year_profit}

    end

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
