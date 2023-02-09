require 'rails_helper'

RSpec.describe PerscriptionDrugSerializer, type: :serializer do
  let (:perscription_drug) { create(:perscription_drug) }

  context "without param :id" do
    it "Should return exact" do
      serialized_persc_drug = PerscriptionDrugSerializer.new(perscription_drug).serializable_hash
      expected = {
        "data": {
          "id": nil,
          "type": "perscription_drug",
          "attributes": {
            "id": nil,
            "usage_description": perscription_drug.usage_description
          }
        }
      }
      expect(serialized_persc_drug.to_json).to be_json_eql(expected.to_json)
    end
  end

  context "with param :id" do
    it "Should return exact" do
      serialized_persc_drug = PerscriptionDrugSerializer.new(perscription_drug, { is_collection: false, params: { id: '' }}).serializable_hash
      expected = {
        "data": {
          "id": nil,
          "type": "perscription_drug",
          "attributes": {
            "id": nil,
            "usage_description": perscription_drug.usage_description,
            "drug": {
              "data": {
                "id": perscription_drug.drug_id.to_s,
                "type": "drug",
                "attributes": {
                  "name": perscription_drug.drug.name,
                  "description": perscription_drug.drug.description
                }
              }
            }
          }
        }
      }
      expect(serialized_persc_drug.to_json).to be_json_eql(expected.to_json)
    end
  end
end
