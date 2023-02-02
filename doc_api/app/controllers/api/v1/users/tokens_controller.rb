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
end
