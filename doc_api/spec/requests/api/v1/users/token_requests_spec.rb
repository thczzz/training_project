require 'rails_helper'
require "base64"

RSpec.describe 'Token requests', type: :request do

  context 'Logging out' do
    let(:user) { create(:patient) }

    before do
      cookies["tokens"] = authorize_for_test(user)
      doorkeeper_app = Doorkeeper::Application.first

      post '/api/v1/oauth/revoke', 
      headers: { 
        'Content-Type' => 'application/json', "Accept" => "application/json",
        'Authorization': "Basic #{Base64.encode64("#{doorkeeper_app.uid}:#{doorkeeper_app.secret}")}"
      }, as: :json
    end

    it 'Should return status 200 OK' do
      response_hash = JSON.parse(response.body)
      expect(response.status).to eq(200)
    end

    it "Should revoke current token" do
      non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
      expect(non_revoked_tokens.size).to eq(0)
    end

    it "Should NOT allow the user to access restricted endpoints" do
      get '/api/v1/patients/examinations'
      expect(response.status).to eq(401)
    end

  end

  context "Obtaining tokens" do
    context "Logging in" do
      let(:user) { create(:patient, confirmed_at: nil) }

      before do
        cookies["tokens"] = authorize_for_test(user)
      end

      it "Should return status 401 Unauthorized and err message" do
        response_hash = JSON.parse(response.body)
        expect(response.status).to eq(401)
        expect(response_hash["message"]).to eq("You have to confirm your email address before continuing.")
      end

      it "Should NOT allow to access restricted endpoint" do
        get '/api/v1/patients/examinations', headers: { 
          'Content-Type' => 'application/json', "Accept" => "application/json" 
        }, as: :json
        expect(response.status).to eq(401)
      end

    end

    context "Refresh token" do
      let(:user) { create(:patient) }

      before do
        cookies["tokens"] = authorize_for_test(user)
        doorkeeper_app = Doorkeeper::Application.first
        user.update_attribute(:confirmed_at, nil)
        user.reload

        post '/api/v1/oauth/token', params: {
          "grant_type": "refresh_token",
          "email": user.email,
          "client_id": doorkeeper_app.uid,
          "client_secret": doorkeeper_app.secret
        }, headers: { 
          'Content-Type' => 'application/json', "Accept" => "application/json" 
        }, as: :json
      end

      it "Should return status 401 Unauthorized with err message" do
        response_hash = JSON.parse(response.body)
        expect(response.status).to eq(401)
        expect(response_hash["message"]).to eq("You have to confirm your email address before continuing.")
      end

    end
  end
end
