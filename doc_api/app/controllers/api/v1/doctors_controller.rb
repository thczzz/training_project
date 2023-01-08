class Api::V1::DoctorsController < ApplicationController
  # before_action :check_if_user_is_doctor
  skip_before_action :doorkeeper_authorize! # For testing purposes!

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
    resources = User.where("username like ?", "%#{search_params[:username]}%").pluck(:id, :username)
    render json: { status: {code: 201, message: "Created"}, data: resources }
  end

  private

    def search_params
      params.permit(:username, :doctor)
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
      return render json: {status: {message: "Err. No permission"}}, status: :unauthorized unless current_user&.role_id == 2
    end

end