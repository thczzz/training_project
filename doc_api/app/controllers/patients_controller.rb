class PatientsController < ApplicationController
  include RackSessionFix 
  before_action :authenticate_user!

  def show
    jwt_payload = JWT.decode(request.headers['Authorization'].split(' ')[1], ENV['DEVISE_JWT_SECRET_KEY']).first
    user_id = jwt_payload["sub"]
    render json: { message: "If you see this, you're in"}, status: :ok
  end

end