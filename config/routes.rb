Rails.application.routes.draw do
  root 'page#index'

  namespace :api do
    resources :sessions, only: [:create]
    resources :registrations , only: [:create]
    resources :products
    resources :reviews
  end
  
  delete '/api/sessions/logout', to: 'api/sessions#logout'
  get '/api/sessions/logged_in', to: 'api/sessions#logged_in'

  get '*path', to: 'page#index', via: :all
end
