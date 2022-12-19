# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  # before_action :configure_sign_up_params, only: [:create]
  # before_action :configure_account_update_params, only: [:update]
  respond_to :json

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource/sign_up
  def create
    new_user = User.new(set_create_or_update_params(params))
    if new_user.save
      register_success
    else
      register_failed(new_user.errors)
    end
  end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT/PATCH /resource
  def update
    jwt_payload = JWT.decode(request.headers['Authorization'].split(' ')[1], Devise.jwt.secret).first
    puts(jwt_payload['user_id'])
  end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

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

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end

  private

    def respond_with(resource, _opts = {})
      register_success && return if resource.persisted?

      register_failed
    end

    def register_success
      render json: { message: "Signed up successfully." }, status: :ok
    end

    def register_failed(errors)
      render json: { message: errors }, status: 406
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
