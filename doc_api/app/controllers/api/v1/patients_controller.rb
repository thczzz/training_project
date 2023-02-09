class Api::V1::PatientsController < ApplicationController

  def examinations
    resources = current_user.examinations.page(params[:page]).without_count.per(1)
    # render json: {}, serializer: Abc, status :ok
    _next_page ||= resources.next_page || ''
    render json: { status: {code: 200, message: "OK"}, next_page: _next_page, data: ExaminationSerializer.new(resources, { is_collection: true, params: { id: '' }}).serializable_hash} 
  end

  # def print_perscription_details

  # end

end
