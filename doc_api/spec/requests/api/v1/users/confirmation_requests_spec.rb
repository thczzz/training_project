require 'rails_helper'

RSpec.describe 'Email confirmation requests', type: :request do

  context 'Sending confirmation' do
    it 'should always return status 200 OK and success message, even if wrong/non-existent email ( Devise paranoid is ON )' do
      post '/api/v1/users/confirmation', params: { "user": { "email": "nonexistentuzer@protonmail.com" } }, 
        headers: { 
          'Content-Type' => 'application/json', "Accept" => "application/json" 
        }, as: :json

      response_hash = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(response_hash["status"]["message"]).to eq('If your email address exists in our database, you will receive an email with instructions for how to confirm your email address in a few minutes.')
    end
  end

  context "Confirming the email/account" do
    context "With Invalid token" do
      it 'should return status 422 and err. message' do
        get '/api/v1/users/confirmation?confirmation_token=yxqN8oFxdQxcK2dZGiiE'

        response_hash = JSON.parse(response.body)

        expect(response.status).to eq(422)
        expect(response_hash).to eq({"confirmation_token"=>["is invalid"]})
      end
    end

    context "With Valid token" do
      let (:unconfirmed_user) { create(:patient, confirmed_at: nil) }

      before do
        post '/api/v1/users/confirmation', params: { "user": { "email": unconfirmed_user.email } }, 
        headers: { 
          'Content-Type' => 'application/json', "Accept" => "application/json" 
        }, as: :json
      end

      it 'should return status 200 and success message' do
        expect(unconfirmed_user.confirmed_at).to eq(nil)
        expect(unconfirmed_user.confirmed?).to be(false)

        token = extract_token_from_email("confirmation")

        expect(unconfirmed_user.confirmation_token).to eq(token)

        get "/api/v1/users/confirmation?confirmation_token=#{token}"
        response_hash = JSON.parse(response.body)

        expect(response.status).to eq(200)
        expect(unconfirmed_user.reload.confirmed?).to be(true)
        expect(response_hash["status"]["message"]).to eq("Your email address has been successfully confirmed.")
      end
    end

  end

end
