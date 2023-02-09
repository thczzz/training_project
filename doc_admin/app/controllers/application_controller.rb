class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :check_if_user_is_admin

  private

  def check_if_user_is_admin
    if current_user && current_user.role_id != 1
      sign_out current_user
      flash[:error] = "Insufficient rights!"
      redirect_to(new_user_session_path) && return
    end
  end

end
