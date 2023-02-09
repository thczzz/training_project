require 'rails_helper'

RSpec.describe "SessionsController", type: :request do
  let(:doc_role)     { create(:doctor_role) }
  let(:patient_role) { create(:patient_role) }
  let(:admin_user)   { create(:admin) }
  let(:doc_user)     { create(:doctor, role_id: doc_role.id) }
  let(:patient_user) { create(:patient, role_id: patient_role.id) }

  context "Login attempt" do
    context "Admin User" do

      it "Should login the admin user and redirect to dashboard" do
        post user_session_url, params: {
          "user": {
            "email": admin_user.email,
            "password": "123456"
          }
        }
        expect(response).to redirect_to(root_path)
        expect(flash[:notice]).to be_present
      end

    end

    context "Doctor User" do
      it "Should NOT log in the User" do
        post user_session_url, params: {
          "user": {
            "email": doc_user.email,
            "password": "123456"
          }
        }
        expect(response).to redirect_to(new_user_session_url)
        expect(flash[:error]).to be_present
      end
    end

    context "Patient User" do
      it "Should NOT log in the User" do
        post user_session_url, params: {
          "user": {
            "email": patient_user.email,
            "password": "123456"
          }
        }
        expect(response).to redirect_to(new_user_session_url)
        expect(flash[:error]).to be_present
      end
    end
  end

  context "Logout" do
    before do
      sign_in admin_user
    end

    it "Should logout the Admin User, redirect to the login page" do
      delete destroy_user_session_url
      expect(response).to redirect_to(new_user_session_url)
    end
  end
end
