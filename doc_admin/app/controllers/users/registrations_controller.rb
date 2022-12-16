# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]
  prepend_before_action :require_no_authentication, only: :cancel
  before_action :get_roles
  before_action :set_user, only: %i[ edit update destroy ]

  # GET /admin/create_user
  def new
    super
  end

  # POST /admin/create_user
  def create
    @new_user = User.new(set_create_or_update_params(params))
    if @new_user.save 
      flash[:success] = "Successfully created new User."
    else
      flash[:error]   = "There was an error when trying to create an User"
    end
    redirect_back(fallback_location: root_path)
  end

  # GET /admin/edit_user/:id
  def edit
    super
  end

  # PUT /admin/edit_user/:id
  def update
    if @user.update(set_create_or_update_params(params))
      flash[:success] = "Successfully Edited User."
    else
      flash[:error] = "There was an error when trying to edit an User"
    end
    redirect_back(fallback_location: root_path)
  end

  # DELETE /admin/delete_user/:id
  def destroy
    if @user.delete
      flash[:success] = "Successfully deleted an User"
    else
      flash[:error] = "There was an error when trying to delete User"
    end
    redirect_back(fallback_location: root_path)
  end

  protected

    # If you have extra params to permit, append them to the sanitizer.
    def configure_sign_up_params
      devise_parameter_sanitizer.permit(:sign_up,
        keys: [:first_name, :last_name, :address, :date_of_birth, :role_id, :username])
    end

    # If you have extra params to permit, append them to the sanitizer.
    def configure_account_update_params
      devise_parameter_sanitizer.permit(:account_update,
        keys: [:first_name, :last_name, :address, :date_of_birth, :role_id, :username])
    end

  private
  
    def get_roles
      @roles = Role.all
    end

    def set_user
      @user = User.find(params[:id])
    end

    def set_create_or_update_params(params)
      {
        first_name:            params[:user][:first_name],
        last_name:             params[:user][:last_name],
        address:               params[:user][:address],
        date_of_birth:         params[:user][:date_of_birth],
        role_id:               params[:user][:role_id].to_i,
        username:              params[:user][:username],
        email:                 params[:user][:email],
        password:              params[:user][:password],
        password_confirmation: params[:user][:password_confirmation]
      }
    end

end
