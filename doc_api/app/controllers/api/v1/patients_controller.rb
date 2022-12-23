class Api::V1::PatientsController < ApiController
  # before_action :authenticate_user!

  def show
    User.all
  end

end