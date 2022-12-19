Rails.application.routes.draw do
  devise_for :users,
             :controllers => {
              :registrations => "users/registrations",
              :sessions      => "users/sessions"
            }

  get '/patient-dashboard', to: 'patients#show'

  devise_scope :user do
    post 'users/sign_up' => 'users/registrations#create'
  end

  # Defines the root path route ("/")
  # root "articles#index"
  # devise_for :users
end
