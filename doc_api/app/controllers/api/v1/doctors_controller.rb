class Api::V1::DoctorsController < ApplicationController

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

  end

  private

    def examination_params
      params.require(:examination).permit(:user_id, :weight_kg, :height_cm, :anamnesis)
    end

    def perscription_params
      params.require(:perscription).permit(:examination_id, :description)
    end

    def drug_params
      params.require(:drug).permit(:name, :description)
    end

end