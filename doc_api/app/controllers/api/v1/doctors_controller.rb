class Api::V1::DoctorsController < ApplicationController
  before_action :check_if_user_is_doctor
  # skip_before_action :doorkeeper_authorize! # For testing purposes!

  def create_examination
    ActiveRecord::Base.transaction do
      status, examination_or_errors = ExaminationCreator.call(*examination_creator_params)
      raise ActiveRecord::ActiveRecordError unless status == true
    rescue StandardError => e
      render json: { errors: examination_or_errors, e: }, status: :unprocessable_entity
      raise ActiveRecord::Rollback
    else
      render json: { status: { code: 201, message: "Created" },
                     data:   ExaminationSerializer.new(examination_or_errors).serializable_hash[:data][:attributes] }
    end
  end

  def create_perscription
    ActiveRecord::Base.transaction do
      status, perscription_or_errors = PerscriptionCreator.call(*perscription_creator_params)
      raise ActiveRecord::ActiveRecordError unless status == true
    rescue StandardError => e
      render json: { errors: perscription_or_errors, e: }, status: :unprocessable_entity
      raise ActiveRecord::Rollback
    else
      render json: { status: { code: 201, message: "Created" },
                     data:   PerscriptionSerializer.new(perscription_or_errors).serializable_hash[:data][:attributes] }
    end
  end

  def search_user
    if search_user_params[:username]
      resources = User.where("lower(username) like ?", "%#{search_user_params[:username].downcase}%").pluck(:id,
                                                                                                            :username)
      render json: { status: { code: 302, message: "Found" }, data: resources }
    else
      render json: { message: "Err" }, status: :unprocessable_entity
    end
  end

  def get_user_examinations
    if get_user_examinations_params[:user_id]
      resources = Examination.where(user_id: get_user_examinations_params[:user_id].to_i).order(
        created_at: :desc
      ).pluck(:id, :created_at)
      render json: { status: { code: 302, message: "Found" }, data: resources }
    else
      render json: { message: "Err" }, status: :unprocessable_entity
    end
  end

  def search_drug
    if search_drug_params[:name]
      resources = Drug.where("lower(name) like ?", "%#{search_drug_params[:name].downcase}%").pluck(:id, :name)
      render json: { status: { code: 302, message: "Found" }, data: resources }
    else
      render json: { message: "Err" }, status: :unprocessable_entity
    end
  end

  private
    def search_user_params\
      # TODO: => params.require(:doctor).permit(:username)
      params.permit(:username, :doctor)
    end

    def search_drug_params
      params.permit(:name, :doctor)
    end

    def get_user_examinations_params
      params.permit(:user_id, :doctor)
    end

    def examination_params
      params.require(:examination).permit(:user_id, :weight, :height, :anamnesis, :attach_perscription, :description,
                                          perscription_drugs: %i[id description title])
    end

    def examination_creator_params
      [
        examination_params["user_id"],
        examination_params["weight"],
        examination_params["height"],
        examination_params["anamnesis"],
        examination_params["attach_perscription"],
        examination_params["description"],
        examination_params["perscription_drugs"]
      ]
    end

    def perscription_params
      params.require(:perscription).permit(:examination_id, :description,
                                           perscription_drugs: %i[id description title])
    end

    def perscription_creator_params
      [
        perscription_params["examination_id"],
        perscription_params["description"],
        perscription_params["perscription_drugs"]
      ]
    end

    def check_if_user_is_doctor
      return if current_user&.role_id == 2 || current_user&.role_id == 1

      render json:   { status: { message: "Err. No permission" } },
             status: :unauthorized
    end
end
