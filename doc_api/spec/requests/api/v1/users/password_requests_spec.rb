require "rails_helper"

RSpec.describe "Password change requests", type: :request do
  context "Sending PW reset token" do
    it "should always return status 200 OK and success message, even
      if wrong/non-existent email ( Devise paranoid is ON )" do
      post "/api/v1/users/password", params: { "user": { "email": "nonexistentuzer@protonmail.com" } },
        headers: {
          "Content-Type" => "application/json", "Accept" => "application/json"
        }, as: :json

      response_hash = JSON.parse(response.body)

      expect(response.status).to eq(200)
      expect(response_hash["status"]["message"]).to eq("If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.")
    end
  end

  context "Attemp to change the password" do
    context "With Invalid token" do
      it "should return status 422 and err. message" do
        patch "/api/v1/users/password",
              params: {
                "user": {
                  "password": "12345678",
                  "password_confirmation": "12345678",
                  "reset_password_token": "RANDOM&INVALID_TOKEN"
                }
              },
              headers: {
                "Content-Type" => "application/json", "Accept" => "application/json"
              }, as: :json

        response_hash = JSON.parse(response.body)
        expect(response.status).to eq(422)
        expect(response_hash["errors"]).to eq({ "reset_password_token" => ["is invalid"] })
      end
    end

    context "With Valid token" do
      let(:user) { create(:patient) }
      let(:doorkeeper_app) { Doorkeeper::Application.create!(name: "React", redirect_uri: "", scopes: "") }

      before do
        Doorkeeper::AccessToken.create_for(
          application: doorkeeper_app,
          resource_owner: user,
          scopes: "",
          initial_create: Time.now,
          **{ "use_refresh_token": true, "expires_in": 900 }
        )

        post "/api/v1/users/password",
             params: {
               "user": {
                 "email": user.email
               }
             },
             headers: {
               "Content-Type" => "application/json", "Accept" => "application/json"
             }, as: :json

        @pw_reset_token = extract_token_from_email("reset_password")
      end

      context "With valid password & password_confirmation" do
        before do
          non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
          expect(non_revoked_tokens.length).to eq(1)

          patch "/api/v1/users/password",
                params: {
                  "user": {
                    "password": "12345678",
                    "password_confirmation": "12345678",
                    "reset_password_token": @pw_reset_token
                  }
                },
                headers: {
                  "Content-Type" => "application/json", "Accept" => "application/json"
                }, as: :json
        end

        it "Should return status 200 and message" do
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(200)
          expect(response_hash["status"]["message"]).to eq("Your password has been changed successfully. You'll have to login again.")
        end

        it "Should revoke all current tokens for the User" do
          non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
          expect(non_revoked_tokens.length).to eq(0)
        end
      end

      context "With Invalid password & password_confirmation" do
        before do
          patch "/api/v1/users/password",
                params: {
                  "user": {
                    "password": "1234567",
                    "password_confirmation": "12345678",
                    "reset_password_token": @pw_reset_token
                  }
                },
                headers: {
                  "Content-Type" => "application/json", "Accept" => "application/json"
                }, as: :json
        end

        it "Should return status 422 and error message" do
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(422)
          expect(response_hash["errors"]).to eq({ "password_confirmation" => ["doesn't match Password"] })
        end

        it "Should NOT revoke any current tokens for the User" do
          non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
          expect(non_revoked_tokens.length).to eq(1)
        end
      end
    end
  end
end
