require "rails_helper"

RSpec.describe "Shared Controller", type: :request do
  context "when Unauthorized" do

    context "when GET /api/v1/user_info" do
      it "returns status 401 Unauthorized and empty body" do
        get "/api/v1/user_info"
        expect(response.status).to eq(401)
        expect(response.body).to eq("")
      end
    end

    context "when GET /api/v1/user_type" do
      it "returns status 401 Unauthorized and empty body" do
        get "/api/v1/user_type"
        expect(response.status).to eq(401)
        expect(response.body).to eq("")
      end
    end
  end

  context "when Authorized" do
    let(:user) { create(:patient) }

    before do
      cookies["tokens"] = authorize_for_test(user)
    end

    it "returns status 200" do
      expected_response = {
        status:
          {
            code: 200,
            message: "OK"
          },
          data: UserSerializer.new(user).serializable_hash
      }.to_json

      get "/api/v1/user_info"
      expect(response.status).to eq(200)
      expect(response.body).to eq(expected_response)
    end

    it "returns status 200" do
      expected_response = {
        status:
          {
            code: 200,
            message: "OK"
          },
          data: [user.role_id, user.email]
      }.to_json

      get "/api/v1/user_type"

      expect(response.status).to eq(200)
      expect(response.body).to eq(expected_response)
    end
  end
end
