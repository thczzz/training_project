Rails.application.routes.draw do
  draw :api

  devise_scope :user do
    post 'api/v1/users/sign_up' => 'api/v1/users/registrations#create'
  end

end
