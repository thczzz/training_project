# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  before_action -> { authenticate_user!(force: true) }
  # prepend_before_action :require_no_authentication, only: [:cancel]
  before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]
  before_action :get_roles
  before_action :set_user, only: %i[ edit update destroy ]

  # GET /admin/create_user
  def new
    super
  end

  # POST /admin/create_user
  def create
    build_resource(sign_up_params)

    resource.skip_confirmation!
    resource.save
    yield resource if block_given?
    if resource.persisted?
      set_flash_message! :notice, :signed_up
      respond_with resource, location: after_sign_up_path_for(resource)
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource, status: :unprocessable_entity
    end
  end

  # GET /admin/edit_user/:id
  def edit
    super
  end

  def update
    self.resource = @user
    resource.skip_reconfirmation!
    if resource.update(set_create_or_update_params(params))
      flash[:success] = "Successfully Edited User."
      redirect_back(fallback_location: root_path)
    else
      respond_with(resource) do |format|
        format.turbo_stream {
          render turbo_stream:
            turbo_stream.replace(
              "error_explanation",
              partial: "devise/shared/error_messages",
              locals: { resource: resource }
            )
        }
      end
    end
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

    def after_sign_up_path_for(resource)
      new_user_registration_path
    end

    def after_update_path_for(resource)
      view_user_admin_path(resource.id)
    end

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
