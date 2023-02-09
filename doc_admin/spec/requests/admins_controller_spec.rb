require 'rails_helper'

RSpec.describe "AdminsController", type: :request do

  shared_examples "Unauthorized" do 
    context 'Unauthorized' do
      it "Redirects to the login page" do
        get root_url
        expect(response).to redirect_to(new_user_session_url)
      end

      it "Redirects to the login page" do
        get dashboard_admin_url
        expect(response).to redirect_to(new_user_session_url)
      end

      it "Redirects to the login page" do
        get new_role_admin_url
        expect(response).to redirect_to(new_user_session_url)
      end

      it "Redirects to the login page" do
        post new_role_admin_url
        expect(response).to redirect_to(new_user_session_url)
      end

      it "Redirects to the login page" do
        get view_user_admin_url(id: 1)
        expect(response).to redirect_to(new_user_session_url)
      end

      it "Redirects to the login page" do
        get new_drug_admin_url
        expect(response).to redirect_to(new_user_session_url)
      end

      it "Redirects to the login page" do
        post create_drug_admin_url
        expect(response).to redirect_to(new_user_session_url)
      end
    end
  end

  context "Authorized" do

    context "Doctor User" do
      let (:role) { create(:doctor_role) }
      let(:user) { create(:doctor, role_id: role.id) }

      before do
        sign_in user
      end

      it_behaves_like "Unauthorized"
    end

    context "Patient User" do
      let (:role) { create(:patient_role) }
      let(:user) { create(:patient, role_id: role.id) }

      before do
        sign_in user
      end

      it_behaves_like "Unauthorized"
    end

    context "Admin User" do
      let(:user) { create(:admin) }
      let(:role) { create(:patient_role) }
      let(:patient_user) { create(:patient, role_id: role.id) }

      before do
        sign_in user
      end

      it "returns status 200 OK" do
        get root_url
        expect(response.status).to eq(200) 
      end

      it "returns status 200 OK" do
        get dashboard_admin_url
        expect(response.status).to eq(200) 
      end

      it "returns status 200 OK" do
        get new_role_admin_url
        expect(response.status).to eq(200) 
      end

      context "Creating New Role" do
        context "Wit valid params" do
          it "Successfully creates new role" do
            post new_role_admin_url, params: {
              "role": {
                "name": "test_role",
                "description": "test_role"
              }
            }
            expect(response.status).to eq(302)
            expect(Role.where(name: "test_role").size).to eq(1)
            expect(flash[:success]).to be_present
          end
        end

        context "With Invalid params" do
          it "Does not create new role" do
            post new_role_admin_url, params: {
              "role": {
                "name": "test_error",
                "description": ""
              }
            }
            expect(Role.where(name: "test_error").size).to eq(0)
            expect(flash[:error]).to be_present
          end
        end
      end

      context "Viewing User" do
        context "With existing User ID" do
          it "returns status 200 OK" do
            get view_user_admin_url(id: patient_user.id)
            expect(response.status).to eq(200)
          end
        end

        context "With NON-existent User" do
          it "Should display flash error message" do 
            get view_user_admin_url(id: "thishouldraise")
            expect(flash[:error]).to be_present
          end
        end
      end

      it "returns status 200 OK" do
        get new_drug_admin_url
        expect(response.status).to eq(200)
      end

      context "When Creating new Drug" do
        context "With Valid params" do
          it "Successfully creates new Drug" do
            post create_drug_admin_url, params: {
              "drug": {
                "name": "Vitamin D3",
                "description": "It's not always sunny"
              }
            }
            expect(response.status).to eq(302)
            expect(flash[:success]).to be_present
            expect(Drug.where(name: "Vitamin D3").size).to eq(1)
          end
        end

        context "With Invalid params" do
          it "does NOT create new Drug" do
            post create_drug_admin_url, params: {
              "drug": {
                "name": "drugerr"
              }
            }
            expect(Drug.where(name: "drugerr").size).to eq(0)
            expect(flash[:error]).to be_present
          end
        end
      end
    end
  end
end
