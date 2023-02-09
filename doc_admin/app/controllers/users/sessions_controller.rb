# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]
  skip_before_action :authenticate_user!, :only => [:new, :create]
  skip_before_action :check_if_user_is_admin, :only => [:new, :create]

  # GET /admin/login
  def new
    super
  end

  # POST /admin/login
  def create
    self.resource = warden.authenticate!(auth_options)
    if resource.role_id == 1
      sign_in(resource_name, resource)
      set_flash_message!(:notice, :signed_in)
    else
      sign_out
      flash[:error] = "Insufficient rights!"
      redirect_to(new_user_session_path) && return
    end
    yield resource if block_given?
    respond_with resource, location: after_sign_in_path_for(resource)
  end

  # DELETE /admin/logout
  def destroy
    super
  end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end

  private 

    def after_sign_out_path_for(resource)
      new_user_session_url
    end

end
