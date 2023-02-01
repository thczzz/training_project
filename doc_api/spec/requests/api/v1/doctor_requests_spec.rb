
require 'rails_helper'

RSpec.describe 'Doctors requests', type: :request do

  context 'Unauthorized' do
    it 'should return status 401 Unauthorized' do
      get '/api/v1/doctors/search_drug'
      expect(response.status).to eq(401)
      expect(response.body).to eq('')

      get '/api/v1/doctors/search_user'
      expect(response.status).to eq(401)
      expect(response.body).to eq('')

      get '/api/v1/doctors/user_examinations'
      expect(response.status).to eq(401)
      expect(response.body).to eq('')

      post '/api/v1/doctors/create_perscription'
      expect(response.status).to eq(401)
      expect(response.body).to eq('')

      post '/api/v1/doctors/create_examination'
      expect(response.status).to eq(401)
      expect(response.body).to eq('')
    end

  end

  context 'Authorized but not Doctor/Admin' do
    let(:user) { create(:patient) }
    before do
      cookies["tokens"] = authorize_for_test(user)
    end

    it 'should return status 401 Unauthorized' do
      get '/api/v1/doctors/search_drug'
      expect(response.status).to eq(401)

      get '/api/v1/doctors/search_user'
      expect(response.status).to eq(401)

      get '/api/v1/doctors/user_examinations'
      expect(response.status).to eq(401)

      post '/api/v1/doctors/create_perscription'
      expect(response.status).to eq(401)

      post '/api/v1/doctors/create_examination'
      expect(response.status).to eq(401)
    end
  end

  context 'Authorized as Doctor' do
    let(:doc_role) { create(:doctor_role) }
    let(:user) { create(:doctor, role: doc_role) }
    let(:patient) { create(:patient) }
    let(:drug) { create(:drug) }

    before do
      cookies["tokens"] = authorize_for_test(user)
    end

    context 'with valid Params' do
      it 'should return status 200 OK' do
        create(:drug)
        get '/api/v1/doctors/search_drug', params: { :name => 'drug' }
        body = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(body["data"].length).to eq(1)
      end

      it 'should return status 200 OK' do
        get '/api/v1/doctors/search_user', params: { :username => 'user' }
        body = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(body["data"].length).to eq(1)
      end

      it 'should return status 200 OK' do
        get '/api/v1/doctors/user_examinations', params: { :user_id => '1' }
        body = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(body["data"].length).to eq(0)
      end

      context 'Create Examination' do
        context "when attach_perscription is 'on' " do

          it 'should return status 200 OK and Create Examination, Perscription, PerscriptionDrug' do
            post '/api/v1/doctors/create_examination', params: {
              'examination': {
                'user_id': patient.id,
                'weight': '90.5',
                'height': '188',
                'anamnesis': 'Test Anamnesis',
                'attach_perscription': 'on',
                'description': 'Test Perscription Description',
                'perscription_drugs': [
                  {
                    'id': drug.id,
                    'description': 'Usage Description',
                    'title': drug.name
                  }
                ]
              }
            }, headers: { 
              'Content-Type' => 'application/json', "Accept" => "application/json" 
            }, as: :json
            response_hash = JSON.parse(response.body)

            expect(response.status).to eq(200)
            expect(response_hash["data"]["weight_kg"]).to eq(90.5)
            expect(response_hash["data"]["height_cm"]).to eq(188.0)
            expect(response_hash["data"]["anamnesis"]).to eq('Test Anamnesis')
            expect(Perscription.all.count).to eq(1)
            expect(Perscription.first.description).to eq('Test Perscription Description')
            expect(Perscription.first.examination_id).to eq(response_hash["data"]["id"].to_i)
            expect(PerscriptionDrug.all.count).to eq(1)
            expect(PerscriptionDrug.first.drug_id).to eq(drug.id)
            expect(PerscriptionDrug.first.usage_description).to eq('Usage Description')
          end
        end

        context "when attach_perscription is 'off' " do

          it 'should return status 200 OK and only Create Examination' do
            post '/api/v1/doctors/create_examination', params: {
              'examination': {
                'user_id': patient.id,
                'weight': '90.5',
                'height': '188',
                'anamnesis': 'Test Anamnesis',
                'attach_perscription': 'off',
                'description': 'Test Perscription Description',
              }
            }, headers: { 
              'Content-Type' => 'application/json', "Accept" => "application/json" 
            }, as: :json
            response_hash = JSON.parse(response.body)
            
            expect(response.status).to eq(200)
            expect(response_hash["data"]["weight_kg"]).to eq(90.5)
            expect(response_hash["data"]["height_cm"]).to eq(188.0)
            expect(response_hash["data"]["anamnesis"]).to eq('Test Anamnesis')
            expect(Perscription.all.count).to eq(0)
            expect(PerscriptionDrug.all.count).to eq(0)
          end
        end
      end

      context 'Create Perscription' do
        let (:examination) { create(:examination, user: patient) }
        it 'should return status 200 OK and Create Perscription with Perscription Drugs' do
          post '/api/v1/doctors/create_perscription', params: {
            'perscription': {
              'examination_id': examination.id,
              'description': 'Test Perscription Description',
              'perscription_drugs': [
                {
                  'id': drug.id,
                  'description': 'Usage Description',
                  'title': drug.name
                }
              ]
            }
          }, headers: { 
            'Content-Type' => 'application/json', "Accept" => "application/json" 
          }, as: :json
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(200)
        end

      end

    end

    context 'with Invalid Params' do
      it 'should return status 422' do
        get '/api/v1/doctors/search_drug', params: { :bad_param => 'drug' }
        expect(response.status).to eq(422)
        expect(JSON.parse(response.body)["message"]).to eq("Err")
      end

      it 'should return status 422' do
        get '/api/v1/doctors/search_user', params: { :bad_param => 'user' }
        expect(response.status).to eq(422)
        expect(JSON.parse(response.body)["message"]).to eq("Err")
      end

      it 'should return status 422' do
        get '/api/v1/doctors/user_examinations', params: { :bad_param => '1' }
        expect(response.status).to eq(422)
        expect(JSON.parse(response.body)["message"]).to eq("Err")
      end

      context 'Create Examination' do
        it 'should return status 422 with errors if perscription_drugs is empty' do
          post '/api/v1/doctors/create_examination', params: {
            'examination': {
              'user_id': patient.id,
              'weight': '90.5',
              'height': '188',
              'anamnesis': 'Test Anamnesis',
              'attach_perscription': 'on',
              'description': 'Test Perscription Description',
              'perscription_drugs': [{}]
            }
          }, headers: { 
            'Content-Type' => 'application/json', "Accept" => "application/json" 
          }, as: :json
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(422)
          expect(response_hash["errors"][0]).to eq("Perscription Drugs cannot be empty!")
          expect(Examination.all.count).to eq(0)
          expect(Perscription.all.count).to eq(0)
          expect(PerscriptionDrug.all.count).to eq(0)
        end

        it 'should return status 422 if wrong params passed' do
          post '/api/v1/doctors/create_examination', params: {
            'examinatio': {
              'user_id': patient.id,
              'weightt': '90.5',
              'heightt': '188',
              'anamnesiss': 'Test Anamnesis',
              'attach_perscription': 'off',
              'description': 'Test Perscription Description',
            }
          }, headers: { 
            'Content-Type' => 'application/json', "Accept" => "application/json" 
          }, as: :json
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(422)
          expect(Examination.all.count).to eq(0)
          expect(Perscription.all.count).to eq(0)
          expect(PerscriptionDrug.all.count).to eq(0)
        end

        it 'should return status 422 with msg if Examination didnt save' do
          post '/api/v1/doctors/create_examination', params: {
            'examination': {
              'user_id': patient.id,
              'weight': '90.5',
              'height': 'well done',
              'anamnesis': 'Test Anamnesis',
              'attach_perscription': 'off',
              'description': 'Test Perscription Description',
            }
          }, headers: { 
            'Content-Type' => 'application/json', "Accept" => "application/json" 
          }, as: :json
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(422)
          expect(response_hash["errors"][0][0]).to eq("Height cm is not a number")
          expect(Examination.all.count).to eq(0)
          expect(Perscription.all.count).to eq(0)
          expect(PerscriptionDrug.all.count).to eq(0)
        end

        it 'should return status 422 with msg if Perscription didnt save' do
          post '/api/v1/doctors/create_examination', params: {
            'examination': {
              'user_id': patient.id,
              'weight': '90.5',
              'height': '188',
              'anamnesis': 'Test Anamnesis',
              'attach_perscription': 'on',
              # 'description': 'Test Perscription Description',
              'perscription_drugs': [
                {
                  'id': drug.id,
                  'description': 'Usage Description',
                  'title': drug.name
                }
              ]
            }
          }, headers: { 
            'Content-Type' => 'application/json', "Accept" => "application/json" 
          }, as: :json
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(422)
          expect(response_hash["errors"][0][0]).to eq("Description can't be blank")
          expect(Examination.all.count).to eq(0)
          expect(Perscription.all.count).to eq(0)
          expect(PerscriptionDrug.all.count).to eq(0)
        end

        it 'should return status 422 with msg if Perscription drug didnt save' do
          post '/api/v1/doctors/create_examination', params: {
            'examination': {
              'user_id': patient.id,
              'weight': '90.5',
              'height': '188',
              'anamnesis': 'Test Anamnesis',
              'attach_perscription': 'on',
              'description': 'Test Perscription Description',
              'perscription_drugs': [
                {
                  'id': drug.id,
                  'description': 'Usage Description',
                  'title': drug.name
                },
                {
                  'id': drug.id,
                  'description': 'Usage Description',
                  'title': drug.name
                }
              ]
            }
          }, headers: { 
            'Content-Type' => 'application/json', "Accept" => "application/json" 
          }, as: :json
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(422)
          expect(response_hash["errors"][0][0]).to eq("Drug has already been taken")
          expect(Examination.all.count).to eq(0)
          expect(Perscription.all.count).to eq(0)
          expect(PerscriptionDrug.all.count).to eq(0)
        end
      end

      context 'Create Perscription' do
        let (:examination) { create(:examination, user: patient) }

        it 'should return status 422 with err. message if perscription_drugs is empty' do
          post '/api/v1/doctors/create_perscription', params: {
            'perscription': {
              'examination_id': examination.id,
              'description': 'Test Perscription Description',
              'perscription_drugs': []
            }
          }, headers: { 
            'Content-Type' => 'application/json', "Accept" => "application/json" 
          }, as: :json
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(422)
          expect(response_hash["errors"][0]).to eq("Perscription Drugs cannot be empty!")
          expect(Perscription.all.count).to eq(0)
          expect(PerscriptionDrug.all.count).to eq(0)
        end

        it 'should return status 422 with err. message if Examination does not exist' do
          post '/api/v1/doctors/create_perscription', params: {
            'perscription': {
              'examination_id': ' qwerty',
              'description': 'Test Perscription Description',
              'perscription_drugs': [{
                'id': drug.id,
                'description': 'Usage Description',
                'title': drug.name
              }]
            }
          }, headers: { 
            'Content-Type' => 'application/json', "Accept" => "application/json" 
          }, as: :json
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(422)
          expect(response_hash["errors"][0][0]).to eq("Examination must exist")
          expect(Perscription.all.count).to eq(0)
          expect(PerscriptionDrug.all.count).to eq(0)
        end

        it 'should return status 422 with err. message if Persc. drug already exists for current Persc.' do
          post '/api/v1/doctors/create_perscription', params: {
            'perscription': {
              'examination_id': examination.id,
              'description': 'Test Perscription Description',
              'perscription_drugs': [{
                'id': drug.id,
                'description': 'Usage Description',
                'title': drug.name
              },
              {
                'id': drug.id,
                'description': 'Usage Description',
                'title': drug.name
              }
            ]
            }
          }, headers: { 
            'Content-Type' => 'application/json', "Accept" => "application/json" 
          }, as: :json
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(422)
          expect(response_hash["errors"][0][0]).to eq("Drug has already been taken")
          expect(Perscription.all.count).to eq(0)
          expect(PerscriptionDrug.all.count).to eq(0)
        end

        it 'should return status 422 if wrong params' do
          post '/api/v1/doctors/create_perscription', params: {
            'asdperscription': {
              'examination_id': examination.id,
              'descriptionn': 'Test Perscription Description',
              'perscription_drugz': [{
                'id': drug.id,
                'description': 'Usage Description',
                'title': drug.name
              }],
            }
          }, headers: { 
            'Content-Type' => 'application/json', "Accept" => "application/json" 
          }, as: :json
          response_hash = JSON.parse(response.body)
          expect(Perscription.all.count).to eq(0)
          expect(PerscriptionDrug.all.count).to eq(0)
        end
      end
    end
  end
end
