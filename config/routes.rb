Rails.application.routes.draw do
  root 'page#index'
  get '*path', to: 'page#index', via: :all
end
