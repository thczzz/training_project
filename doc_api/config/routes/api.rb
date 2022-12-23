# frozen_string_literal: true

namespace :api do
  namespace :v1 do
    scope :users, module: :users do
      post '/', to: "registrations#create", as: :user_registration
    end
    resource :doctors
    resource :patients
  end
end

scope :api do
  scope :v1 do
    use_doorkeeper do
      skip_controllers :authorizations, :applications, :authorized_applications
      controllers tokens: 'api/v1/users/tokens'
    end
    devise_for :users,
            :controllers => {
              :registrations => "api/v1/users/registrations",
              :confirmations => "api/v1/users/confirmations",
              :passwords     => "api/v1/users/passwords"
            }, defaults: { format: :json }, skip: %i[sessions]
  end
end

