class ApplicationController < ActionController::Base
  before_action :verify_is_admin

  private
    def verify_is_admin
      (current_user.nil?) ? redirect_to(new_user_session_path) : (raise ActiveRecord::RecordNotFound, "Record not found." unless current_user.role.id == 1)
    end
end
