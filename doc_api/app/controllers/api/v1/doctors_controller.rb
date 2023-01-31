class Api::V1::DoctorsController < ApplicationController
  before_action :check_if_user_is_doctor
  # skip_before_action :doorkeeper_authorize! # For testing purposes!

  def create_examination
    errors = []
    ActiveRecord::Base.transaction do
      begin
        examination = Examination.new(
          user_id:   examination_params[:user_id],
          weight_kg: examination_params[:weight],
          height_cm: examination_params[:height],
          anamnesis: examination_params[:anamnesis]
        )
        if !examination.save
          errors.append(examination.errors.full_messages)
          raise ActiveRecord::ActiveRecordError
        end

        if examination_params[:attach_perscription] == "on"
          
          if !examination_params[:perscription_drugs] || examination_params[:perscription_drugs].empty? || examination_params[:perscription_drugs][0].empty?
            errors.append("Perscription Drugs cannot be empty!")
            raise ActiveRecord::ActiveRecordError
          end

          perscription = Perscription.new(
            examination_id: examination.id,
            description:    examination_params[:description]
          )
          if !perscription.save
            errors.append(perscription.errors.full_messages)
            raise ActiveRecord::ActiveRecordError
          end
  
          examination_params[:perscription_drugs].each do |persc_drug|
            new_persc_drug = PerscriptionDrug.new(
              drug_id:           persc_drug["id"],
              usage_description: persc_drug["description"],
              perscription_id:   perscription.id
            )
  
            if !new_persc_drug.save
              errors.append(new_persc_drug.errors.full_messages)
              raise ActiveRecord::ActiveRecordError
            end
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

  def create_perscription
    errors = []
    ActiveRecord::Base.transaction do
      begin

        if !perscription_params[:perscription_drugs] || perscription_params[:perscription_drugs].empty? || perscription_params[:perscription_drugs][0].empty?
          errors.append("Perscription Drugs cannot be empty!")
          raise ActiveRecord::ActiveRecordError
        end

        perscription = Perscription.new(
          examination_id: perscription_params[:examination_id],
          description:    perscription_params[:description]
        )
        if !perscription.save
          errors.append(perscription.errors.full_messages)
          raise ActiveRecord::ActiveRecordError
        end

        perscription_params[:perscription_drugs].each do |persc_drug|
          new_persc_drug = PerscriptionDrug.new(
            drug_id:           persc_drug["id"],
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
        render json: { status: {code: 201, message: "Created"}, data: PerscriptionSerializer.new(perscription).serializable_hash[:data][:attributes] }
      end

    end
  end

  def search_user
    if search_user_params[:username]
      resources = User.where("lower(username) like ?", "%#{search_user_params[:username].downcase}%").pluck(:id, :username)
      render json: { status: {code: 302, message: "Found"}, data: resources }
    else
      render json: { message: "Err" }, status: :unprocessable_entity
    end
  end

  def get_user_examinations
    if get_user_examinations_params[:user_id]
      resources = Examination.where(user_id: get_user_examinations_params[:user_id].to_i).order(created_at: :desc).pluck(:id, :created_at)
      render json: { status: {code: 302, message: "Found"}, data: resources }
    else
      render json: { message: "Err" }, status: :unprocessable_entity
    end
  end

  def search_drug
    if search_drug_params[:name]
      resources = Drug.where("lower(name) like ?", "%#{search_drug_params[:name].downcase}%").pluck(:id, :name)
      render json: { status: {code: 302, message: "Found"}, data: resources }
    else
      render json: { message: "Err" }, status: :unprocessable_entity
    end
  end

  private

    def search_user_params\
      # todo => params.require(:doctor).permit(:username)
      params.permit(:username, :doctor)
    end

    def search_drug_params
      params.permit(:name, :doctor)
    end

    def get_user_examinations_params
      params.permit(:user_id, :doctor)
    end

    def examination_params
      params.require(:examination).permit(:user_id, :weight, :height, :anamnesis, :attach_perscription, :description, perscription_drugs: [:id, :description, :title])
    end

    def perscription_params
      params.require(:perscription).permit(:examination_id, :description, perscription_drugs: [:id, :description, :title])
    end

    def check_if_user_is_doctor
      return render json: {status: {message: "Err. No permission"}}, status: :unauthorized unless current_user&.role_id == 2 || current_user&.role_id == 1
    end

end
