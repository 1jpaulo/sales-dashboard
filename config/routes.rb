Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "sales#index"

  get 'sales/all_years', to: 'sales#all_years', as: 'years'
  get 'sales/:year', to: 'sales#year_sales_profit_by_month', as: 'year_profit'
  get 'sales/:year_one/:year_two/:month', to: 'sales#month_sales_profit', as: 'month_profit'
end
