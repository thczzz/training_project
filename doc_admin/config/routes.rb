Rails.application.routes.draw do
  devise_for :users,
             :controllers => {
               :registrations => "users/registrations",
               :sessions      => "users/sessions"
             }, defaults: { format: :html },
             :skip => [:sessions, :registrations, :passwords, :confirmations]

  resource :admin, :except => [:show, :new, :create, :edit, :update, :destroy] do
    get  'new_role',      to: 'admins#new_role'
    post 'new_role',      to: 'admins#create_role'
    get  'dashboard',     to: 'admins#dashboard'
    get  'view_user/:id', to: 'admins#view_user',   :as => :view_user
    get  'new_drug',      to: 'admins#new_drug',    :as => :new_drug
    post 'new_drug',      to: 'admins#create_drug', :as => :create_drug
  end

  devise_scope :user do 
    get    'admin/login'           => 'users/sessions#new',          :as => :new_user_session
    post   'admin/login'           => 'users/sessions#create',       :as => :user_session
    delete 'admin/logout'          => 'users/sessions#destroy',      :as => :destroy_user_session
    get    'admin/create_user'     => 'users/registrations#new',     :as => :new_user_registration
    post   'admin/create_user'     => 'users/registrations#create'
    put    'admin/edit_user/:id'   => 'users/registrations#update',  :as => :edit_user_registration
    patch  'admin/edit_user/:id'   => 'users/registrations#update'
    delete 'admin/delete_user/:id' => 'users/registrations#destroy', :as => :delete_user_registration
  end
  # Override default devise urls, check out: https://gist.github.com/JamesChevalier/4703255

  # Defines the root path route ("/")
  root "admins#dashboard"
end
