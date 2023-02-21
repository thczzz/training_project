require "rails_helper"

RSpec.describe "Registrations requests", type: :request do
  before do
    create(:admin_role)
    create(:doctor_role)
    create(:patient_role)
  end

  context "Registering an account" do
    context "With valid params" do
      before do
        post "/api/v1/users/sign_up",
             params: {
               "user": {
                 "first_name": "Petar",
                 "last_name": "Smith",
                 "address": "Ardino",
                 "date_of_birth": "2022-12-19",
                 "username": "uniqueacc2",
                 "email": "uniqueacc2@protonmail.com",
                 "password": "123456",
                 "password_confirmation": "123456"
               }
             },
             headers: {
               "Content-Type" => "application/json", "Accept" => "application/json"
             }, as: :json
      end

      it "Should return status 200 and success message" do
        response_hash = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(response_hash["status"]["message"]).to eq("A message with a confirmation link has been sent to your email address. Please follow the link to activate your account.")
      end

      it "Should create User with role_id: 3(patient)" do
        expect(User.first.role_id).to eq(3)
      end

      it "Should create the User with status unconfirmed" do
        expect(User.first.confirmed?).to eq(false)
      end
    end

    context "With Invalid params" do
      context "With unpermitted parameter role_id" do
        it "Should create the user with role_id: 3(Patient) even if we pass role_id: 1(admin)" do
          post "/api/v1/users/sign_up", params: {
                                          "user": {
                                            "first_name": "Petar",
                                            "last_name": "Smith",
                                            "address": "Ardino",
                                            "date_of_birth": "2022-12-19",
                                            "username": "uniqueacc2",
                                            "role_id": "1",
                                            "email": "uniqueacc2@protonmail.com",
                                            "password": "123456",
                                            "password_confirmation": "123456"
                                          }
                                        },
          headers: {
            "Content-Type" => "application/json", "Accept" => "application/json"
          }, as: :json

          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(200)
          expect(response_hash["status"]["message"]).to eq("A message with a confirmation link has been sent to your email address. Please follow the link to activate your account.")
          expect(User.first.role_id).to eq(3)
          expect(User.first.confirmed?).to eq(false)
        end
      end

      context "With missing first_name, misspelled last_name" do
        before do
          post "/api/v1/users/sign_up", params: {
                                          "user": {
                                            "last_namee": "Smith",
                                            "address": "Ardino",
                                            "date_of_birth": "2022-12-19",
                                            "username": "uniqueacc2",
                                            "role_id": "1",
                                            "email": "uniqueacc2@protonmail.com",
                                            "password": "123456",
                                            "password_confirmation": "123456"
                                          }
                                        },
          headers: {
            "Content-Type" => "application/json", "Accept" => "application/json"
          }, as: :json
        end

        it "Should return status 422 and error message" do
          response_hash = JSON.parse(response.body)
          expect(response.status).to eq(422)
          expect(response_hash["errors"]).to eq({ "first_name" => ["can't be blank"],
"last_name" => ["can't be blank"] })
        end

        it "Should not register the User" do
          expect(User.all.size).to eq(0)
        end
      end
    end
  end

  context "Updating an account" do
    context "Unauthenticated" do
      before do
        patch "/api/v1/users", params: {
                                 "user": {
                                   "first_name": "Petar",
                                   "last_name": "Smith",
                                   "address": "Ardino",
                                   "date_of_birth": "2022-12-19",
                                   "username": "uniqueacc2",
                                   "email": "uniqueacc2@protonmail.com",
                                   "password": "123456",
                                   "password_confirmation": "123456"
                                 }
                               },
        headers: {
          "Content-Type" => "application/json", "Accept" => "application/json"
        }, as: :json
      end

      it "Should return status 401 Unauthenticated" do
        expect(response.status).to eq(401)
      end
    end

    context "Authenticated" do
      let(:user) { create(:patient, role_id: 3) }

      before do
        cookies["tokens"] = authorize_for_test(user)
      end

      context "With Valid Params" do
        context "When email was changed" do
          before do
            patch "/api/v1/users", params: {
                                     "user": {
                                       "current_password": "123456",
                                       "email": "uniqueacc2@protonmail.com"
                                     }
                                   },
            headers: {
              "Content-Type" => "application/json", "Accept" => "application/json"
            }, as: :json
          end

          it "Should return status 200 and email changed message" do
            response_hash = JSON.parse(response.body)
            expect(response.status).to eq(200)
            expect(response_hash["status"]["message"]).to eq(["You updated your account successfully, but we need to verify your new email address. Please check your email and follow the confirmation link to confirm your new email address."])
            expect(response_hash["actions"]).to eq("pw_updated" => false)
          end

          it "Should not change current User's email until it was confirmed" do
            expect(user.reload.email).to_not eq("uniqueacc2@protonmail.com")
          end

          it "Should not revoke any tokens" do
            non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
            expect(non_revoked_tokens.size).to eq(1)
          end

          it "Should add the new email to user.unconfirmed_email" do
            expect(user.reload.unconfirmed_email).to eq("uniqueacc2@protonmail.com")
          end

          it "Should change user.current_email after confirmation" do
            token = extract_token_from_email("confirmation")

            get "/api/v1/users/confirmation?confirmation_token=#{token}"
            response_hash = JSON.parse(response.body)

            expect(response.status).to eq(200)
            expect(user.reload.email).to eq("uniqueacc2@protonmail.com")
            expect(response_hash["status"]["message"]).to eq("Your email address has been successfully confirmed.")
          end
        end

        context "When Password was Changed" do
          before do
            patch "/api/v1/users", params: {
                                     "user": {
                                       "current_password": "123456",
                                       "password": "12345678",
                                       "password_confirmation": "12345678"
                                     }
                                   },
            headers: {
              "Content-Type" => "application/json", "Accept" => "application/json"
            }, as: :json
          end

          it "Should return password changed message" do
            response_hash = JSON.parse(response.body)
            expect(response.status).to eq(200)
            expect(response_hash["status"]["message"]).to eq(["Your account has been updated successfully, but since your password was changed, you need to sign in again."])
            expect(response_hash["actions"]).to eq("pw_updated" => true)
          end

          it "Should revoke all current tokens" do
            non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
            expect(non_revoked_tokens.size).to eq(0)
          end

          it "Should NOT allow the user to access restricted endpoint" do
            get "/api/v1/patients/examinations"
            expect(response.status).to eq(401)

            get "/api/v1/doctors/search_drug"
            expect(response.status).to eq(401)
          end
        end

        context "When Email & Password were changed" do
          before do
            patch "/api/v1/users", params: {
                                     "user": {
                                       "email": "uniqueacc2@protonmail.com",
                                       "current_password": "123456",
                                       "password": "12345678",
                                       "password_confirmation": "12345678"
                                     }
                                   },
            headers: {
              "Content-Type" => "application/json", "Accept" => "application/json"
            }, as: :json
          end

          it "should return status 200 and both messages" do
            response_hash = JSON.parse(response.body)
            expect(response.status).to eq(200)
            expect(response_hash["status"]["message"]).to eq(
              [
                "You updated your account successfully, but we need to verify your new email address. Please check your email and follow the confirmation link to confirm your new email address.",
                "Your account has been updated successfully, but since your password was changed, you need to sign in again."
              ]
            )
            expect(response_hash["actions"]).to eq("pw_updated" => true)
          end

          it "Should not change current User's email until it was confirmed" do
            expect(user.reload.email).to_not eq("uniqueacc2@protonmail.com")
          end

          it "Should revoke all current tokens" do
            non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
            expect(non_revoked_tokens.size).to eq(0)
          end

          it "Should NOT allow the user to access restricted endpoint" do
            get "/api/v1/patients/examinations"
            expect(response.status).to eq(401)

            get "/api/v1/doctors/search_drug"
            expect(response.status).to eq(401)
          end
        end

        context "When password, password_confirmation were not provided" do
          before do
            patch "/api/v1/users", params: {
                                     "user": {
                                       "first_name": "Petar",
                                       "last_name": "Smith",
                                       "current_password": "123456"
                                     }
                                   },
            headers: {
              "Content-Type" => "application/json", "Accept" => "application/json"
            }, as: :json
          end

          it "Should return status 200 and message" do
            response_hash = JSON.parse(response.body)
            expect(response.status).to eq(200)
            expect(response_hash["status"]["message"]).to eq(["Your account has been updated successfully."])
            expect(response_hash["actions"]).to eq("pw_updated" => false)
          end

          it "Should update User's first_name and last_name" do
            expect(user.reload.first_name).to eq("Petar")
            expect(user.reload.last_name).to eq("Smith")
          end

          it "Should NOT revoke any tokens" do
            non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
            expect(non_revoked_tokens.size).to eq(1)
          end

          it "Should allow the user to access restricted endpoint" do
            get "/api/v1/patients/examinations"
            expect(response.status).to eq(200)
          end
        end
      end

      context "With Invalid Params" do
        context "Without current_password" do
          before do
            patch "/api/v1/users", params: {
                                     "user": {
                                       "first_name": "Petar",
                                       "last_name": "Smith"
                                     }
                                   },
            headers: {
              "Content-Type" => "application/json", "Accept" => "application/json"
            }, as: :json
          end

          it "Should return status 422 and message" do
            response_hash = JSON.parse(response.body)
            expect(response.status).to eq(422)
            expect(response_hash["errors"]).to eq({ "current_password" => ["can't be blank"] })
          end

          it "Should NOT update user's first_name and last_name" do
            expect(user.reload.first_name).to_not eq("Petar")
            expect(user.reload.last_name).to_not eq("Smith")
          end

          it "Should NOT revoke any tokens" do
            non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
            expect(non_revoked_tokens.size).to eq(1)
          end
        end

        context "with unpermitted param role_id" do
          before do
            patch "/api/v1/users", params: {
                                     "user": {
                                       "role_id": "1",
                                       "current_password": "123456"
                                     }
                                   },
            headers: {
              "Content-Type" => "application/json", "Accept" => "application/json"
            }, as: :json
          end

          it "Should return status 200 and message" do
            response_hash = JSON.parse(response.body)
            expect(response.status).to eq(200)
            expect(response_hash["status"]["message"]).to eq(["Your account has been updated successfully."])
            expect(response_hash["actions"]).to eq("pw_updated" => false)
          end

          it "Should not change User's role_id" do
            expect(user.reload.role_id).to eq(3)
          end
        end

        context "with wrong params" do
          before do
            patch "/api/v1/users", params: {
                                     "user": {
                                       "first_namee": "Petar",
                                       "last_namee": "Smith",
                                       "addressz": "Ardino",
                                       "date_of_birthh": "1955-12-19",
                                       "usernamee": "uniqueacc2",
                                       "current_password": "123456",
                                       "emaill": "uniqueacc2@protonmail.com",
                                       "passwordd": "123456",
                                       "password_confirmationn": "123456"
                                     }
                                   },
            headers: {
              "Content-Type" => "application/json", "Accept" => "application/json"
            }, as: :json
          end

          it "should return status 200 and message" do
            response_hash = JSON.parse(response.body)
            expect(response.status).to eq(200)
            expect(response_hash["status"]["message"]).to eq(["Your account has been updated successfully."])
            expect(response_hash["actions"]).to eq("pw_updated" => false)
          end

          it "Should NOT update anything" do
            expect(user.reload.first_name).to_not eq("Petar")
            expect(user.reload.last_name).to_not eq("Smith")
            expect(user.reload.address).to_not eq("Ardino")
            expect(user.reload.date_of_birth.to_s).to_not eq("1955-12-19")
            expect(user.reload.username).to_not eq("uniqueacc2")
            expect(user.reload.unconfirmed_email).to_not eq("uniqueacc2@protonmail.com")
          end

          it "Should NOT revoke any of the User's tokens" do
            non_revoked_tokens = Doorkeeper::AccessToken.by_resource_owner(user).where(revoked_at: nil)
            expect(non_revoked_tokens.size).to eq(1)
          end
        end

        context "With date_of_birth in the future" do
          before do
            @date_in_future = Faker::Date.forward(days: 365)
            patch "/api/v1/users", params: {
                                     "user": {
                                       "date_of_birth": @date_in_future.to_s,
                                       "current_password": "123456"
                                     }
                                   },
            headers: {
              "Content-Type" => "application/json", "Accept" => "application/json"
            }, as: :json
          end

          it "should return status 422 with err message" do
            response_hash = JSON.parse(response.body)
            expect(response.status).to eq(422)
            expect(response_hash["errors"]).to eq({ "date_of_birth" => ["can't be in the future"] })
          end

          it "should NOT update user's date_of_birth" do
            expect(user.reload.date_of_birth.to_s).to_not eq(@date_in_future)
          end
        end
      end
    end
  end
end
