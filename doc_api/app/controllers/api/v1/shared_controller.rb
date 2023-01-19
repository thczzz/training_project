class Api::V1::SharedController < ApplicationController
#   skip_before_action :doorkeeper_authorize!

  def get_current_user
    resource = current_user
    # resource = User.first
    render json: { status: {code: 200, message: "OK"}, data: UserSerializer.new(resource).serializable_hash}
  end

end