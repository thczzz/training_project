Rails.application.routes.draw do
  devise_for :users,
             :controllers => {
              :registrations => "users/registrations",
              :sessions      => "users/sessions",
              :confirmations => "users/confirmations",
              :passwords     => "users/passwords"
            }, defaults: { format: :json }

  get '/patient-dashboard', to: 'patients#show'

  devise_scope :user do
    post 'users/sign_up' => 'users/registrations#create'
  end

end
