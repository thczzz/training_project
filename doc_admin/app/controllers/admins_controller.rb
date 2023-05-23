class AdminsController < ApplicationController
  before_action :get_roles, only: %i[view_user dashboard]

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

  def new_drug
    @drug = Drug.new
  end

  def create_drug
    @drug = Drug.new(drug_params)
    if @drug.save
      flash[:success] = "Drug was successfully created"
    else
      flash[:error] = "There was an error when trying to create a Drug."
    end
    redirect_back(fallback_location: root_path)
  end

  def dashboard
    @users = Rails.cache.fetch('users', expires_in: 5.minutes){ 
      User.includes(:role)
    }
    @users = @users.where(role_id: params[:role_id]) if params[:role_id].present?
    @users = @users.where(username: params[:username]) if params[:username].present?
    @users = @users.page params[:page]
  end

  def view_user
    @resource = Rails.cache.fetch('user', expires_in: 5.minutes){ 
      User.find(params[:id])
    }
  rescue ActiveRecord::RecordNotFound => e
    flash[:error] = "User with id #{params[:id]} does not exist."
    redirect_back(fallback_location: root_path)
  end

  private
    def role_params
      params.require(:role).permit(:name, :description)
    end

    def drug_params
      params.require(:drug).permit(:name, :description)
    end

    def get_roles
      @roles = Role.all
    end
end
