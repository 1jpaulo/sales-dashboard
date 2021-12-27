Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "sales#index"

  get 'sales/all_years', to: 'sales#all_years', as: 'years'
  get 'sales/all_months/:year', to: 'sales#all_months', as: 'months'
  get 'sales/:year', to: 'sales#year_sales_profit_by_month', as: 'year_profit'
  get 'sales/:year/:month', to: 'sales#month_sales_by_day', as: 'month_profit'
end
