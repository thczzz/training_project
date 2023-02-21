require "rails_helper"

RSpec.describe PerscriptionSerializer, type: :serializer do
  let(:perscription) { create(:perscription) }

  context "without param :id" do
    it "Should return exact" do
      serialized_persc = PerscriptionSerializer.new(perscription).serializable_hash
      persc_id_string = perscription.id.to_s

      expect(serialized_persc).to eq(
        {
          data:
          {
            id: perscription.id.to_s,
            type: :perscription,
            attributes: {
              id: perscription.id,
                description: perscription.description,
                created_at: perscription.created_at
            }
          }
        }
      )
    end
  end

  context "With param :id" do
    it "Should return exact hash" do
      persc_drug = create(:perscription_drug, perscription_id: perscription.id)
      serialized_persc = PerscriptionSerializer.new(perscription,
                                                    { is_collection: false, params: { id: "" } }).serializable_hash
      expected = {
        "data": {
          "id": perscription.id.to_s,
          "type": "perscription",
          "attributes": {
            "id": perscription.id,
            "description": perscription.description,
            "created_at": perscription.created_at.to_s,
            "perscription_drugs": {
              "data": [
                {
                  "id": nil.to_json,
                  "type": "perscription_drug",
                  "attributes": {
                    "id": nil.to_json,
                    "usage_description": persc_drug.usage_description,
                    "drug": {
                      "data": {
                        "id": persc_drug.id.to_s,
                        "type": "drug",
                        "attributes": {
                          "name": persc_drug.drug.name,
                          "description": persc_drug.drug.description
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      }.to_json

      expect(serialized_persc.to_json).to be_json_eql(expected)
    end
  end
end
