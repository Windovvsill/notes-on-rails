Rails.application.routes.draw do
  root "notes#index"

  # Can be replaced with ...
  # get 'notes', to: "notes#index"
  # get 'notes/:id', to: "notes#show"
  # resources :notes

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
