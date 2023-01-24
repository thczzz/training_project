class Api::V1::SharedController < ApplicationController

  def get_current_user
    resource = current_user
    render json: { status: {code: 200, message: "OK"}, data: UserSerializer.new(resource).serializable_hash}
  end

  def get_user_type
    render json: { status: {code: 200, message: "OK"}, data: [current_user.role_id, current_user.email]}
  end

end