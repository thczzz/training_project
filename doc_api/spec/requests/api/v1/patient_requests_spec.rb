
require 'rails_helper'

RSpec.describe 'Patients', type: :request do
  describe 'GET /api/v1/patients/examinations' do

    context 'Unauthorized' do
      it 'should return status 401 Unauthorized' do
        get '/api/v1/patients/examinations'
        expect(response.status).to eq(401)
      end

      it 'should return empty response.body' do
        get '/api/v1/patients/examinations'
        expect(response.body).to eq('')
      end
    end

    context 'Authorized' do
      let(:user) { create(:patient) }
      let(:examination) { create(:examination, user: user) }
      let(:perscription) { create(:perscription, examination: examination) }

      before do
        cookies["tokens"] = authorize_for_test(user)
      end

      it 'should return status 200' do
        get '/api/v1/patients/examinations'
        expect(response.status).to eq(200)
      end

      it 'should return body with this format' do
        create(:perscription_drug, perscription: perscription)
        resources = user.examinations.page(1).without_count.per(1)
        expected_response = { 
          status: 
            { 
              code: 200, 
              message: "OK" 
            }, 
            next_page: '', 
            data: ExaminationSerializer.new(resources, { is_collection: true, params: { id: '' }}).serializable_hash 
        }.to_json

        get '/api/v1/patients/examinations'
        expect(response.body).to eq(expected_response)
      end
    end

  end

end
