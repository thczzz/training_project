# frozen_string_literal: true

class Api::V1::Users::PasswordsController < Devise::PasswordsController
  include UsersPrivateMethods
  skip_before_action :doorkeeper_authorize!

  # GET /resource/password/new
  # def new
  #   super
  # end

  # POST /resource/password
  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)
    yield resource if block_given?

    successfully_sent, notice = successfully_sent?(resource)
    if successfully_sent
      message = set_flash_message(:notice, notice)
      respond_with(resource, {:message => message})
    else
      respond_with(resource)
    end
  end

  # GET /resource/password/edit?reset_password_token=abcdef
  # def edit
  #   super
  # end

  # PUT /resource/password
  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      resource.revoke_user_token
      resource.reload
      message = set_flash_message(:notice, :updated_not_active)
      respond_with(resource, {:message => message})
    else
      set_minimum_password_length
      respond_with resource
    end
  end

  private
    
    def respond_with(resource, _opts = {})
      super && return if !_opts[:message]
      response_success = { status: {code: 200} }
      response_success[:status][:message] = _opts[:message]
      render json: response_success
    end

end
