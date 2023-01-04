# frozen_string_literal: true

namespace :api do
  namespace :v1 do
    scope :users, module: :users do
      post '/', to: "registrations#create", as: :user_registration
    end

    scope :doctors do
      post '/create_examination',  to: "doctors#create_examination",       as: :create_examination
      post '/create_perscription', to: "doctors#create_perscription",      as: :create_perscription
      post '/create_drug',         to: "doctors#create_drug",              as: :create_drug
      post '/create_persc_drug',   to: "doctors#create_perscription_drug", as: :create_persc_drug
    end

    scope :patients do
      get '/examinations',         to: "patients#examinations",            as: :view_examinations
      get '/perscriptions',        to: "patients#perscriptions",           as: :view_perscriptions
      get '/perscriptions/:id',    to: "patients#perscription_details",    as: :view_perscription_details
      get '/examinations/:id',     to: "patients#examination_details",     as: :view_examination_details
    end
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

