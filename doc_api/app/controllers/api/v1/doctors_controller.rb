class Api::V1::DoctorsController < ApplicationController
  before_action :check_if_user_is_doctor
  # skip_before_action :doorkeeper_authorize! # For testing purposes!

  def create_examination
    errors = []
    ActiveRecord::Base.transaction do
      begin
        examination = Examination.new(
          user_id:   examination_params[:Patient].to_i,
          weight_kg: examination_params[:weight_kg].to_f,
          height_cm: examination_params[:height].to_f,
          anamnesis: examination_params[:anamnesis]
        )
        if !examination.save
          errors.append(examination.errors.full_messages)
          raise ActiveRecord::ActiveRecordError
        end

        perscription = Perscription.new(
          examination_id: examination.id,
          description:    examination_params[:comment]
        )
        if !perscription.save
          errors.append(perscription.errors.full_messages)
          raise ActiveRecord::ActiveRecordError
        end

        examination_params[:perscription_drugs].each do |persc_drug|
          new_persc_drug = PerscriptionDrug.new(
            drug_id:           persc_drug["id"].to_i,
            usage_description: persc_drug["description"],
            perscription_id:   perscription.id
          )

          if !new_persc_drug.save
            errors.append(new_persc_drug.errors.full_messages)
            raise ActiveRecord::ActiveRecordError
          end

        end

      rescue
        render json: {errors: errors}, status: :unprocessable_entity
        raise ActiveRecord::Rollback
      else
        render json: { status: {code: 201, message: "Created"}, data: ExaminationSerializer.new(examination).serializable_hash[:data][:attributes] }
      end
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
      params.require(:examination).permit(:Patient, :weight, :height, :anamnesis, :attach_perscription, :comment, perscription_drugs: [:id, :description, :title])
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