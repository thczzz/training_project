class Api::V1::DoctorsController < ApplicationController
  before_action :check_if_user_is_doctor
  # skip_before_action :doorkeeper_authorize! # For testing purposes!

  def create_examination
    resource = Examination.new(examination_params)

    if resource.save
      render json: { status: {code: 201, message: "Created"}, data: ExaminationSerializer.new(resource).serializable_hash[:data][:attributes] }
    else
      messages = ''
      resource.errors.full_messages.each { |msg| messages += msg + "<br/>" }
      render json: { status: {code: 422, message: messages}}
    end
  end

  def update_examination

  end

  def create_perscription
    resource = Perscription.new(perscription_params)

    if resource.save
      render json: { status: {code: 201, message: "Created"}, data: PerscriptionSerializer.new(resource).serializable_hash[:data][:attributes] }
    else
      messages = ''
      resource.errors.full_messages.each { |msg| messages += msg + "<br/>" }
      render json: { status: {code: 422, message: messages}}
    end
  end

  def create_drug
    resource = Drug.new(drug_params)
    if resource.save
      render json: { status: {code: 201, message: "Created"}, data: DrugSerializer.new(resource).serializable_hash[:data][:attributes] }
    else
      messages = ''
      resource.errors.full_messages.each { |msg| messages += msg + "<br/>" }
      render json: { status: {code: 422, message: messages}}
    end
  end

  def create_perscription_drug
    resource = PerscriptionDrug.new(perscription_drug_params)
    if resource.save
      render json: { status: {code: 201, message: "Created"}, data: PerscriptionDrugSerializer.new(resource).serializable_hash[:data][:attributes] }
    else
      messages = ''
      resource.errors.full_messages.each { |msg| messages += msg + "<br/>" }
      render json: { status: {code: 422, message: messages}}
    end   
  end

  def search_user
    resources = User.where("lower(username) like ?", "%#{search_user_params[:username].downcase}%").pluck(:id, :username)
    render json: { status: {code: 302, message: "Found"}, data: resources }
  end

  def get_user_examinations
    resources = Examination.where(user_id: get_user_examinations_params[:user_id].to_i).order(created_at: :desc).pluck(:id, :created_at)
    render json: { status: {code: 302, message: "Found"}, data: resources }
  end

  def search_drug
    resources = Drug.where("lower(name) like ?", "%#{search_drug_params[:name].downcase}%").pluck(:id, :name)
    render json: { status: {code: 302, message: "Found"}, data: resources }
  end

  private

    def search_user_params
      params.permit(:username, :doctor)
    end

    def search_drug_params
      params.permit(:name, :doctor)
    end

    def get_user_examinations_params
      params.permit(:user_id, :doctor)
    end

    def examination_params
      params.require(:examination).permit(:user_id, :weight_kg, :height_cm, :anamnesis)
    end

    def perscription_params
      params.require(:perscription).permit(:examination_id, :description)
    end

    def drug_params
      params.require(:drug).permit(:name, :description)
    end

    def perscription_drug_params
      params.require(:perscription_drug).permit(:perscription_id, :drug_id, :usage_description)
    end

    def check_if_user_is_doctor
      return render json: {status: {message: "Err. No permission"}}, status: :unauthorized unless current_user&.role_id == 2 || current_user&.role_id == 1
    end

end