class AdminsController < ApplicationController
  before_action :get_roles, only: [:view_user, :dashboard]

  def new_role
    @role = Role.new
  end

  def create_role
    @role = Role.new(role_params)
    if @role.save
      flash[:success] = "Role was successfully created"
    else
      flash[:error] = "There was an error when trying to create a Role."
    end
    redirect_back(fallback_location: root_path)
    # render(json: {role: @role})
  end

  def dashboard
    # todo: paginate results
    @users = User.excluding(current_user).includes(:role)
    if params[:role_id].present?
      @users = @users.where(role_id: params[:role_id])
    end
    if params[:username].present?
      @users = @users.where(username: params[:username])
    end
  end

  def view_user
    @resource = User.find(params[:id])
  end

  private
    def role_params
      params.require(:role).permit(:name, :description)
    end

    def get_roles
      @roles = Role.all
    end

end