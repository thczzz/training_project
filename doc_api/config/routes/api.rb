# frozen_string_literal: true

namespace :api do
  namespace :v1 do

    scope :doctors do
      post '/create_examination',  to: "doctors#create_examination",       as: :create_examination
      post '/create_perscription', to: "doctors#create_perscription",      as: :create_perscription
      get  '/search_user',         to: "doctors#search_user",              as: :search_user
      get  '/user_examinations',   to: "doctors#get_user_examinations",    as: :get_user_examinations
      get  '/search_drug',         to: "doctors#search_drug",              as: :search_drug
    end

    scope :patients do
      get '/examinations',         to: "patients#examinations",            as: :view_examinations
      get '/perscriptions',        to: "patients#perscriptions",           as: :view_perscriptions
      get '/perscriptions/:id',    to: "patients#perscription_details",    as: :view_perscription_details
      get '/examinations/:id',     to: "patients#examination_details",     as: :view_examination_details
    end

    get '/user_info',              to: "shared#get_current_user",          as: :get_user_info
    get '/user_type',              to: "shared#get_user_type",             as: :get_user_type

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

