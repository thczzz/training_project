require "rails_helper"

RSpec.describe "AdminsController", type: :request do
  shared_examples "Unauthorized" do
    context "when Unauthorized" do
      context "when GET root_url" do
        it "Redirects to the login page" do
          get root_url
          expect(response).to redirect_to(new_user_session_url)
        end
      end

      context "when GET dashboard_admin_url" do
        it "Redirects to the login page" do
          get dashboard_admin_url
          expect(response).to redirect_to(new_user_session_url)
        end
      end

      context "when GET new_role_admin_url" do
        it "Redirects to the login page" do
          get new_role_admin_url
          expect(response).to redirect_to(new_user_session_url)
        end
      end

      context "when POST new_role_admin_url" do
        it "Redirects to the login page" do
          post new_role_admin_url
          expect(response).to redirect_to(new_user_session_url)
        end
      end

      context "when GET view_user_admin_url(id: )" do
        it "Redirects to the login page" do
          get view_user_admin_url(id: 1)
          expect(response).to redirect_to(new_user_session_url)
        end
      end

      context "when GET new_drug_admin_url" do
        it "Redirects to the login page" do
          get new_drug_admin_url
          expect(response).to redirect_to(new_user_session_url)
        end
      end

      context "when POST create_drug_admin_url" do
        it "Redirects to the login page" do
          post create_drug_admin_url
          expect(response).to redirect_to(new_user_session_url)
        end
      end
    end
  end

  context "when Authorized" do
    context "when Doctor User" do
      let(:role) { create(:doctor_role) }
      let(:user) { create(:doctor, role_id: role.id) }

      before do
        sign_in user
      end

      it_behaves_like "Unauthorized"
    end

    context "when Patient User" do
      let(:role) { create(:patient_role) }
      let(:user) { create(:patient, role_id: role.id) }

      before do
        sign_in user
      end

      it_behaves_like "Unauthorized"
    end

    context "when Admin User" do
      let(:user) { create(:admin) }
      let(:role) { create(:patient_role) }
      let(:patient_user) { create(:patient, role_id: role.id) }

      before do
        sign_in user
      end

      context "when GET root_url" do
        it "returns status 200 OK" do
          get root_url
          expect(response.status).to eq(200)
        end
      end

      context "when GET dashboard_admin_url" do
        it "returns status 200 OK" do
          get dashboard_admin_url
          expect(response.status).to eq(200)
        end
      end

      context "when GET new_role_admin_url" do
        it "returns status 200 OK" do
          get new_role_admin_url
          expect(response.status).to eq(200)
        end
      end

      context "when Creating New Role" do
        context "with valid params" do
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

        context "with Invalid params" do
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

      context "when Viewing User" do
        context "with existing User ID" do
          it "returns status 200 OK" do
            get view_user_admin_url(id: patient_user.id)
            expect(response.status).to eq(200)
          end
        end

        context "with NON-existent User" do
          it "displays flash error message" do
            get view_user_admin_url(id: "thishouldraise")
            expect(flash[:error]).to be_present
          end
        end
      end

      context "when GET new_drug_admin_url" do
        it "returns status 200 OK" do
          get new_drug_admin_url
          expect(response.status).to eq(200)
        end
      end

      context "when Creating new Drug" do
        context "with Valid params" do
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

        context "with Invalid params" do
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
