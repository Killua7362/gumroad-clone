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

  post '/api/collabs/validate_user', to: 'api/collabs#validate_user'
  get '/api/collabs/products', to: 'api/collabs#index'
  post '/api/collabs/:id/approve', to: 'api/collabs#approve'

  get '/api/profiles/:id', to: 'api/profiles#index'

  get '*path', to: 'page#index', via: :all
end
