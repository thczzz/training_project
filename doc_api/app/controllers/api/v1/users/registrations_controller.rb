# frozen_string_literal: true

class Api::V1::Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]
  before_action :doorkeeper_authorize!, only: [:update, :destroy]
  # skip_before_action :doorkeeper_authorize!

  # POST /resource
  def create
    build_resource(sign_up_params)
    resource.role_id = 3

    resource.save
    yield resource if block_given?
    if resource.persisted?
      if !resource.active_for_authentication?
        expire_data_after_sign_in!
      end
      respond_with resource
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource
    end
  end

  # PUT/PATCH /users
  def update
    self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)
    prev_unconfirmed_email = resource.unconfirmed_email if resource.respond_to?(:unconfirmed_email)

    @resource_updated = update_resource(resource, account_update_params)

    yield resource if block_given?
    if @resource_updated
      respond_with resource, {:prev_unconfirmed_email => prev_unconfirmed_email, :update_action => true}
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource, {:update_action => true}
    end
  end

  # DELETE /users
  def destroy
    resource.destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
    yield resource if block_given?
    respond_with(resource, {destroyed: true})
  end

  protected
    
    def configure_sign_up_params
      devise_parameter_sanitizer.permit(:sign_up,
        # TODO: remove role_id, default = 3 (patient, on create)
        keys: [:first_name, :last_name, :address, :date_of_birth, :username])
    end

    def configure_account_update_params
      devise_parameter_sanitizer.permit(:account_update,
        keys: [:first_name, :last_name, :address, :date_of_birth, :username])
    end

  private
    
    # Override
    def respond_with(resource, _opts = {})
      response_success = { status: {code: 200} }
      if resource.persisted?
        if !_opts[:update_action]
          message = sign_up_success(resource)
        else
          super && return if !@resource_updated
          resource.revoke_user_token if !sign_in_after_change_password?
          resource.reload
          message = update_success(resource, _opts)
        end
      elsif _opts[:destroyed] == true
        resource.revoke_user_token
        message = destroy_success
      else
        ## On Failure
        super && return
      end
      response_success[:status][:message] = message
      render json: response_success
    end

    # Had to override this because of Err: (: unauthorized, You need to sign in or sign up to continue..)
    def authenticate_scope!
      # send(:"authenticate_#{resource_name}!", force: true)
      self.resource = send(:"current_#{resource_name}")
    end

    def sign_up_success(resource)
      if resource.active_for_authentication?
        message = set_flash_message(:notice, :signed_up)
      else
        message = set_flash_message(:notice, :"signed_up_but_#{resource.inactive_message}")
      end
    end

    def update_success(resource, _opts)
      message = set_flash_message_for_update(resource, _opts[:prev_unconfirmed_email]).join("||")
    end

    def destroy_success
      message = set_flash_message(:notice, :destroyed)
    end

    # Override
    def set_flash_message(key, kind, options = {update: true})
      message = find_message(kind, options)
    end

    # Override
    def set_flash_message_for_update(resource, prev_unconfirmed_email)
      messages = []
      messages.push(set_flash_message(:notice, :update_needs_confirmation)) if update_needs_confirmation?(resource, prev_unconfirmed_email)
      if sign_in_after_change_password?
        messages.push(set_flash_message(:notice, :updated)) 
      else
        messages.push(set_flash_message(:notice, :updated_but_not_signed_in))
      end
    end

    # Override
    def sign_in_after_change_password?
      account_update_params[:password].blank?
    end

end
