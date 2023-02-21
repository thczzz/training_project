require "rails_helper"

RSpec.describe "RegistrationsController", type: :request do
  let!(:patient_role) { create(:patient_role) }
  let!(:doc_role)     { create(:doctor_role) }
  let!(:patient_user) { create(:patient, role_id: patient_role.id) }
  let!(:doc_user)     { create(:doctor, role_id: doc_role.id) }
  let!(:admin_user)   { create(:admin) }

  describe "Attempt to access Register new User path" do
    context "when Unauthorized" do
      it "redirects to the login page and display flash" do
        get new_user_registration_url
        expect(response).to redirect_to(new_user_session_url)
        expect(flash[:alert]).to be_present
      end
    end

    context "when Authorized as Doctor" do
      before do
        sign_in doc_user
      end

      it "redirects to the login page and display flash" do
        get new_user_registration_url
        expect(response).to redirect_to(new_user_session_url)
        expect(flash[:error]).to be_present
      end
    end

    context "when Authorized as Patient" do
      before do
        sign_in patient_user
      end

      it "redirects to the login page and display flash" do
        get new_user_registration_url
        expect(response).to redirect_to(new_user_session_url)
        expect(flash[:error]).to be_present
      end
    end

    context "when Authorized as Admin" do
      before do
        sign_in admin_user
      end

      it "returns status 200 OK" do
        get new_user_registration_url
        expect(response.status).to eq(200)
      end
    end
  end

  describe "Attempt to Register new User" do
    let(:create_user_params) do
      { "user": {
        "first_name": "Petar",
        "last_name": "Smith",
        "address": "Ardino",
        "date_of_birth": "2022-12-19",
        "role_id": "2",
        "username": "uniqueacc2",
        "email": "uniqueacc2@protonmail.com",
        "password": "123456",
        "password_confirmation": "123456"
      } }
    end

    context "when Unauthorized" do
      it "redirects to the login page and display flash" do
        post admin_create_user_url, params: create_user_params
        expect(response).to redirect_to(new_user_session_url)
        expect(User.where(username: "uniqueacc2").size).to eq(0)
        expect(flash[:alert]).to be_present
      end
    end

    context "when Authorized as Doctor" do
      before do
        sign_in doc_user
      end

      it "redirects to the login page and display flash" do
        post admin_create_user_url, params: create_user_params
        expect(response).to redirect_to(new_user_session_url)
        expect(User.where(username: "uniqueacc2").size).to eq(0)
        expect(flash[:error]).to be_present
      end
    end

    context "when Authorized as Patient" do
      before do
        sign_in patient_user
      end

      it "redirects to the login page and display flash" do
        post admin_create_user_url, params: create_user_params
        expect(response).to redirect_to(new_user_session_url)
        expect(User.where(username: "uniqueacc2").size).to eq(0)
        expect(flash[:error]).to be_present
      end
    end

    context "when Authorized as Admin" do
      context "with Valid params" do
        before do
          sign_in admin_user
          post admin_create_user_url, params: create_user_params
        end

        it "redirects to the same Page and Create the new user" do
          expect(response).to redirect_to(new_user_registration_path)
          expect(User.where(username: "uniqueacc2").size).to eq(1)
          expect(flash[:notice]).to be_present
        end

        it "confirms the User" do
          expect(User.find_by(username: "uniqueacc2").confirmed?).to eq(true)
        end
      end

      context "with Invalid params" do
        before do
          sign_in admin_user
          post admin_create_user_url, params: {
            "user": {
              "first_name": "Petar",
              "last_name": "Smith",
              "address": "Ardino",
              "date_of_birth": "2022-12-19",
              "username": "uniqueacc2",
              "email": "uniqueacc2@protonmail.com",
              "password": "123456",
              "password_confirmation": "1234"
            }
          }
        end

        it "returns status 422 and not create the User" do
          expect(response.status).to eq(422)
          expect(User.where(username: "uniqueacc2").size).to eq(0)
        end
      end
    end
  end

  describe "Attempt to Update a User" do
    let(:create_user_params) do
      { "user": {
        "first_name": "Petar",
        "last_name": "Smith",
        "address": "Ardino",
        "date_of_birth": "2022-12-19",
        "role_id": "3",
        "username": "uniqueacc2",
        "email": "uniqueacc2@protonmail.com",
        "password": "123456",
        "password_confirmation": "123456"
      } }
    end

    context "when Unauthorized" do
      it "redirects to the login page and display flash" do
        put edit_user_registration_url(id: doc_user.id), params: create_user_params
        expect(response).to redirect_to(new_user_session_url)
        expect(User.where(username: "uniqueacc2").size).to eq(0)
        expect(flash[:alert]).to be_present
      end
    end

    context "when Authorized as Doctor" do
      before do
        sign_in doc_user
      end

      it "redirects to the login page and display flash" do
        put edit_user_registration_url(id: doc_user.id), params: create_user_params
        expect(response).to redirect_to(new_user_session_url)
        expect(User.where(username: "uniqueacc2").size).to eq(0)
        expect(flash[:error]).to be_present
      end
    end

    context "when Authorized as Patient" do
      before do
        sign_in patient_user
      end

      it "redirects to the login page and display flash" do
        put edit_user_registration_url(id: doc_user.id), params: create_user_params
        expect(response).to redirect_to(new_user_session_url)
        expect(User.where(username: "uniqueacc2").size).to eq(0)
        expect(flash[:error]).to be_present
      end
    end

    context "when Authorized as Admin" do
      context "with Valid params" do
        before do
          sign_in admin_user
          put edit_user_registration_url(id: doc_user.id), params: create_user_params
        end

        it "redirects to the Edited User's Page and Edit the User" do
          expect(response).to redirect_to(view_user_admin_url(id: doc_user.id))
          expect(doc_user.reload.username).to eq("uniqueacc2")
          expect(flash[:success]).to be_present
        end

        it "confirms the User" do
          expect(doc_user.reload.confirmed?).to eq(true)
        end
      end

      context "with Invalid params" do
        before do
          sign_in admin_user
          post admin_create_user_url, params: {
            "user": {
              "first_name": "Petar",
              "last_name": "Smith",
              "address": "Ardino",
              "date_of_birth": "2022-12-19",
              "username": "uniqueacc2",
              "email": "uniqueacc2@protonmail.com",
              "password": "123456",
              "password_confirmation": "1234"
            }
          }
        end

        it "returns status 422 and not Edit the User" do
          expect(response.status).to eq(422)
          expect(doc_user.reload.username).not_to eq("uniqueacc2")
        end
      end
    end
  end

  describe "Attempt to Delete a User" do
    context "when Unauthorized" do
      it "redirects to the login page and display flash" do
        users_size_before_delete_attempt = User.all.size
        delete delete_user_registration_url(id: doc_user.id)
        expect(User.all.size).to eq(users_size_before_delete_attempt)
        expect(response).to redirect_to(new_user_session_url)
        expect(flash[:alert]).to be_present
      end
    end

    context "when Authorized as Doctor" do
      before do
        sign_in doc_user
      end

      it "redirects to the login page and display flash" do
        users_size_before_delete_attempt = User.all.size
        delete delete_user_registration_url(id: doc_user.id)
        expect(User.all.size).to eq(users_size_before_delete_attempt)
        expect(response).to redirect_to(new_user_session_url)
        expect(flash[:error]).to be_present
      end
    end

    context "when Authorized as Patient" do
      before do
        sign_in patient_user
      end

      it "redirects to the login page and display flash" do
        users_size_before_delete_attempt = User.all.size
        delete delete_user_registration_url(id: doc_user.id)
        expect(User.all.size).to eq(users_size_before_delete_attempt)
        expect(response).to redirect_to(new_user_session_url)
        expect(flash[:error]).to be_present
      end
    end

    context "when Authorized as Admin" do
      context "with Valid params" do
        before do
          sign_in admin_user
        end

        it "redirects to root path unless redirect_back" do
          users_size_before_delete_attempt = User.all.size
          delete delete_user_registration_url(id: doc_user.id)
          expect(response).to redirect_to(root_path)
          expect(User.all.size).not_to eq(users_size_before_delete_attempt)
          expect(flash[:success]).to be_present
        end
      end

      context "with Invalid params" do
        before do
          sign_in admin_user
        end

        it "does not Delete the User" do
          users_size_before_delete_attempt = User.all.size
          delete delete_user_registration_url(id: 99_999_999_999_999)
          expect(response).to redirect_to(root_path)
          expect(flash[:error]).to be_present
          expect(User.all.size).to eq(users_size_before_delete_attempt)
        end
      end
    end
  end
end
