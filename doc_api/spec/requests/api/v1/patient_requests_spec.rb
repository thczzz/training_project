require "rails_helper"

RSpec.describe "Patients", type: :request do
  describe "GET /api/v1/patients/examinations" do
    context "when Unauthorized" do
      it "returns status 401 Unauthorized" do
        get "/api/v1/patients/examinations"
        expect(response.status).to eq(401)
      end

      it "returns empty response.body" do
        get "/api/v1/patients/examinations"
        expect(response.body).to eq("")
      end
    end

    context "when Authorized" do
      let(:user) { create(:patient) }
      let(:examination) { create(:examination, user:) }
      let(:perscription) { create(:perscription, examination:) }

      before do
        cookies["tokens"] = authorize_for_test(user)
      end

      it "returns status 200" do
        get "/api/v1/patients/examinations"
        expect(response.status).to eq(200)
      end

      it "returns body with this format" do
        create(:perscription_drug, perscription:)
        resources = user.examinations.page(1).without_count.per(1)
        expected_response = {
          status:
            {
              code: 200,
              message: "OK"
            },
            next_page: "",
            data: ExaminationSerializer.new(resources, { is_collection: true, params: { id: "" } }).serializable_hash
        }.to_json

        get "/api/v1/patients/examinations"
        expect(response.body).to eq(expected_response)
      end
    end
  end
end
