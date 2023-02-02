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

      context "Unconfirmed" do 
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

      context "Confirmed User" do
        let(:user) { create(:patient) }

        before do
          cookies["tokens"] = authorize_for_test(user)
        end

        it "Should return status 200 OK and message" do
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(200)
          expect(response_hash["message"]).to eq("Logged in successfully.")
        end

        it "Should set token.initial_create to token.created_at" do
          token = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil).first
          expect(token.created_at.to_i).to eq(token.initial_create.to_i)
        end

      end
    end

    context "Refresh token" do
      let(:user) { create(:patient) }

      context "Unconfirmed user" do

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

      context "Confirmed user" do
        context "When time limit of -12 hours not exceeded" do

          before do
            cookies["tokens"] = authorize_for_test(user)
            @previous_token = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil).first
            doorkeeper_app = Doorkeeper::Application.first

            post '/api/v1/oauth/token', params: {
              "grant_type": "refresh_token",
              "email": user.email,
              "client_id": doorkeeper_app.uid,
              "client_secret": doorkeeper_app.secret
            }, headers: { 
              'Content-Type' => 'application/json', "Accept" => "application/json" 
            }, as: :json
          end

          it "Should return status 200 OK and message" do
            response_hash = JSON.parse(response.body)
            expect(response.status).to eq(200)
            expect(response_hash["message"]).to eq("Logged in successfully.")
          end

          it "Should revoke previous token" do
            expect(@previous_token.reload.revoked_at).to_not eq(nil)
          end

          it "Should set new token.initial_create to previous_token.initial_create" do
            non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
            expect(non_revoked_tokens.size).to eq(1)
            expect(non_revoked_tokens.first.initial_create.to_i).to eq(@previous_token.initial_create.to_i)
            expect(non_revoked_tokens.first.id).to_not eq(@previous_token.id)
          end

        end

        context "When time limit of -12H of first_token Exceeded" do

          before do
            cookies["tokens"] = authorize_for_test(user)
            @previous_token = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil).first
            @previous_token.update_attribute(:initial_create, Time.current.utc - (12.hours + 5.seconds))
            @previous_token.reload
            doorkeeper_app = Doorkeeper::Application.first

            post '/api/v1/oauth/token', params: {
              "grant_type": "refresh_token",
              "email": user.email,
              "client_id": doorkeeper_app.uid,
              "client_secret": doorkeeper_app.secret
            }, headers: { 
              'Content-Type' => 'application/json', "Accept" => "application/json" 
            }, as: :json
          end

          it "Should return status 401 Unauthorized and message" do
            response_hash = JSON.parse(response.body)
            expect(response.status).to eq(400)
            expect(response_hash["error"]).to eq("invalid_grant")
            expect(response_hash["error_description"]).to eq(
              "The provided authorization grant is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client."
            )
          end

          it "Should revoke previous_token" do
            expect(@previous_token.reload.revoked_at).to_not eq(nil)
          end

          it "Should NOT create new token" do
            non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
            expect(non_revoked_tokens.size).to eq(0)
          end

        end
      end
    end
  end
end
