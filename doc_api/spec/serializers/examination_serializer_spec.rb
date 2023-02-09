require 'rails_helper'
require 'pp'

RSpec.describe ExaminationSerializer, type: :serializer do
  let (:examination) { create(:examination) }

  context "without param :id" do
    it "Should return exact" do
      serialized_examination = ExaminationSerializer.new(examination).serializable_hash
      expected = {
        "data": {
          "id": examination.id.to_s,
          "type": "examination",
          "attributes": {
            "id": examination.id,
            "weight_kg": examination.weight_kg,
            "height_cm": examination.height_cm,
            "anamnesis": examination.anamnesis,
            "created_at": examination.created_at
          }
        }
      }
      expect(serialized_examination.to_json).to be_json_eql(expected.to_json)
    end
  end

  context "With param :id" do
    let (:perscription) { create(:perscription, examination_id: examination.id) }
    let (:persc_drug)   { create(:perscription_drug, perscription_id: perscription.id) }

    it "Should return exact" do
      serialized_examination = ExaminationSerializer.new(examination, { is_collection: false, params: { id: '' }}).serializable_hash
      expected = {
        "data": {
          "id": examination.id.to_s,
          "type": "examination",
          "attributes": {
            "id": examination.id,
            "weight_kg": examination.weight_kg,
            "height_cm": examination.height_cm,
            "anamnesis": examination.anamnesis,
            "created_at": examination.created_at,
            "perscriptions": {
              "data": [
                {
                  "id": perscription.id.to_s,
                  "type": "perscription",
                  "attributes": {
                    "id": perscription.id,
                    "description": perscription.description,
                    "created_at": perscription.created_at,
                    "perscription_drugs": {
                      "data": [
                        {
                          "id": nil,
                          "type": "perscription_drug",
                          "attributes": {
                            "id": nil,
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
              ]
            }
          }
        }
      }

      expect(serialized_examination.to_json).to be_json_eql(expected.to_json)
    end
  end

end
