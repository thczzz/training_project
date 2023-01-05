# frozen_string_literal: true

class Api::V1::Users::TokensController < Doorkeeper::TokensController
  before_action :check_if_account_is_pending, only: :create
  
  private
  
  def check_if_account_is_pending
    user = User.find_by(email: params['email'])
    render json: unconfirmed_account_error, status: :unauthorized if user && !user.confirmed?
  end
  
  def unconfirmed_account_error
    { message: I18n.t('devise.failure.unconfirmed') }
  end

  # Override
  def token
    if request.cookies["tokens"]
      token = JSON.parse(request.cookies["tokens"])["access_token"]
      refresh_token = JSON.parse(request.cookies["tokens"])["refresh_token"]
    end
    @token ||=
      if params[:token_type_hint] == "refresh_token"
        Doorkeeper.config.access_token_model.by_refresh_token(refresh_token)
      else
        Doorkeeper.config.access_token_model.by_token(token) ||
          Doorkeeper.config.access_token_model.by_refresh_token(refresh_token)
      end
  end  

end