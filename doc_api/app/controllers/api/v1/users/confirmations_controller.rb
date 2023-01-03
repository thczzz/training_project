# frozen_string_literal: true

class Api::V1::Users::ConfirmationsController < Devise::ConfirmationsController
  include UsersPrivateMethods
  skip_before_action :doorkeeper_authorize!
  # GET /resource/confirmation/new
  # def new
  #   super
  # end

  # POST /resource/confirmation
  def create
    self.resource = resource_class.send_confirmation_instructions(resource_params)
    yield resource if block_given?

    successfully_sent, notice = successfully_sent?(resource)
    if successfully_sent
      message = set_flash_message(:notice, notice)
      respond_with(resource, {:message => message})
    else
      respond_with(resource)
    end
  end

  # GET /resource/confirmation?confirmation_token=abcdef
  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])
    yield resource if block_given?

    if resource.errors.empty?
      message = set_flash_message(:notice, :confirmed)
      respond_with(resource, {:message => message})
    else
      respond_with_navigational(resource.errors, status: :unprocessable_entity){ render :new }
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
