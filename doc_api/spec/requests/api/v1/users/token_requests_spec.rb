require "rails_helper"
require "base64"

RSpec.describe "Token requests", type: :request do
  context "when Logging out" do
    let(:user) { create(:patient) }

    before do
      cookies["tokens"] = authorize_for_test(user)
      doorkeeper_app = Doorkeeper::Application.first

      post "/api/v1/oauth/revoke",
           headers: {
             "Content-Type" => "application/json", "Accept" => "application/json",
             'Authorization': "Basic #{Base64.encode64("#{doorkeeper_app.uid}:#{doorkeeper_app.secret}")}"
           }, as: :json
    end

    it "returns status 200 OK" do
      response_hash = JSON.parse(response.body)
      expect(response.status).to eq(200)
    end

    it "revokes current token" do
      non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
      expect(non_revoked_tokens.size).to eq(0)
    end

    it "does not allow the user to access restricted endpoints" do
      get "/api/v1/patients/examinations"
      expect(response.status).to eq(401)
    end
  end

  context "when Obtaining tokens" do
    context "when Logging in" do
      context "when Unconfirmed" do
        let(:user) { create(:patient, confirmed_at: nil) }

        before do
          cookies["tokens"] = authorize_for_test(user)
        end

        it "returns status 401 Unauthorized and err message" do
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(401)
          expect(response_hash["message"]).to eq("You have to confirm your email address before continuing.")
        end

        it "does not allow to access restricted endpoint" do
          get "/api/v1/patients/examinations", headers: {
            "Content-Type" => "application/json", "Accept" => "application/json"
          }, as: :json
          expect(response.status).to eq(401)
        end
      end

      context "when Confirmed User" do
        let(:user) { create(:patient) }

        before do
          cookies["tokens"] = authorize_for_test(user)
        end

        it "returns status 200 OK and message" do
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(200)
          expect(response_hash["message"]).to eq("Logged in successfully.")
        end

        it "sets token.initial_create to token.created_at" do
          token = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil).first
          expect(token.created_at.to_i).to eq(token.initial_create.to_i)
        end
      end
    end

    context "when Refreshing token" do
      let(:user) { create(:patient) }

      context "when Unconfirmed user" do
        before do
          cookies["tokens"] = authorize_for_test(user)
          user.update_attribute(:confirmed_at, nil)
          user.reload

          post "/api/v1/oauth/token", params: {
            "grant_type": "refresh_token",
            "email": user.email
          }, headers: {
            "Content-Type" => "application/json", "Accept" => "application/json"
          }, as: :json
        end

        it "returns status 401 Unauthorized with err message" do
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(401)
          expect(response_hash["message"]).to eq("You have to confirm your email address before continuing.")
        end
      end

      context "when Confirmed user" do
        context "when time limit of -12 hours not exceeded" do
          before do
            cookies["tokens"] = authorize_for_test(user)
            @previous_token = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil).first

            post "/api/v1/oauth/token", params: {
              "grant_type": "refresh_token",
              "email": user.email
            }, headers: {
              "Content-Type" => "application/json", "Accept" => "application/json"
            }, as: :json
          end

          it "returns status 200 OK and message" do
            response_hash = JSON.parse(response.body)
            expect(response.status).to eq(200)
            expect(response_hash["message"]).to eq("Logged in successfully.")
          end

          it "revokes previous token" do
            expect(@previous_token.reload.revoked_at).not_to eq(nil)
          end

          it "sets new token.initial_create to previous_token.initial_create" do
            non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
            expect(non_revoked_tokens.size).to eq(1)
            expect(non_revoked_tokens.first.initial_create.to_i).to eq(@previous_token.initial_create.to_i)
            expect(non_revoked_tokens.first.id).not_to eq(@previous_token.id)
          end
        end

        context "when time limit of -12H of first_token Exceeded" do
          before do
            cookies["tokens"] = authorize_for_test(user)
            @previous_token = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil).first
            @previous_token.update_attribute(:initial_create, Time.current.utc - (12.hours + 5.seconds))
            @previous_token.reload

            post "/api/v1/oauth/token", params: {
              "grant_type": "refresh_token",
              "email": user.email,
            }, headers: {
              "Content-Type" => "application/json", "Accept" => "application/json"
            }, as: :json
          end

          it "returns status 401 Unauthorized and message" do
            response_hash = JSON.parse(response.body)
            expect(response.status).to eq(400)
            expect(response_hash["error"]).to eq("invalid_grant")
            expect(response_hash["error_description"]).to eq(
              "The provided authorization grant is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client."
            )
          end

          it "revokes previous_token" do
            expect(@previous_token.reload.revoked_at).not_to eq(nil)
          end

          it "does not create new token" do
            non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
            expect(non_revoked_tokens.size).to eq(0)
          end
        end
      end
    end
  end
end
