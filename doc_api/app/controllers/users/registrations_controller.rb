# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]

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
        keys: [:first_name, :last_name, :address, :date_of_birth, :role_id, :username])
    end

    def configure_account_update_params
      devise_parameter_sanitizer.permit(:account_update,
        keys: [:first_name, :last_name, :address, :date_of_birth, :role_id, :username])
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
          revoke_user_token(resource) if !sign_in_after_change_password?
          resource.reload
          message = update_success(resource, _opts)
        end
        response_success[:data] = UserSerializer.new(resource).serializable_hash[:data][:attributes]
      elsif _opts[:destroyed] == true
        message = destroy_success
      else
        ## On Failure
        super && return
      end
      response_success[:status][:message] = message
      render json: response_success
    end

    def sign_up_success(resource)
      if resource.active_for_authentication?
        message = set_flash_message(:notice, :signed_up)
      else
        message = set_flash_message(:notice, :"signed_up_but_#{resource.inactive_message}")
      end
    end
  
    def revoke_user_token(resource)
      User.revoke_jwt(encoded_payload, resource)
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

    ## If Token is missing, will raise Exception. Check if user can make a req before Update in the React app!
    def encoded_payload
      request.headers['Authorization'].split(' ')[1]
    end

    # Override
    def sign_in_after_change_password?
      account_update_params[:password].blank?
    end
end
