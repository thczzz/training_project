class Api::V1::PatientsController < ApplicationController
  # before_action :authenticate_user!
  # skip_before_action :doorkeeper_authorize!

  def perscriptions
    resources = Perscription.where(examination_id: current_user_examinations_arr)
    render json: { status: {code: 200, message: "OK"}, data: PerscriptionSerializer.new(resources, is_collection: true).serializable_hash} 
  end

  def perscription_details
    resource = Perscription.find_by(id: params[:id], examination_id: current_user_examinations_arr)
    render json: { status: {code: 200, message: "OK"}, data: PerscriptionSerializer.new(resource, { params: { id: '' }}).serializable_hash}
  end

  def examinations
    resources = current_user.examinations.page(params[:page]).without_count.per(1)
    # resources = User.first.examinations.page(params[:page]).without_count.per(1)
    # render json: {}, serializer: Abc, status :ok
    _next_page ||= resources.next_page || ''
    render json: { status: {code: 200, message: "OK"}, next_page: _next_page, data: ExaminationSerializer.new(resources, { is_collection: true, params: { id: '' }}).serializable_hash} 
  end

  def examination_details
    resource = current_user.examinations.find_by(id: params[:id])
    render json: { status: {code: 200, message: "OK"}, data: ExaminationSerializer.new(resource).serializable_hash}
  end

  def print_perscription_details

  end

  private

    def current_user_examinations_arr
      current_user.examinations.pluck(:id)
    end

end