require 'rails_helper'

RSpec.describe UserSerializer, type: :serializer do
  let (:drug) { create(:drug) }

  it "Should return exact" do
    serialized_drug = DrugSerializer.new(drug).serializable_hash
    expect(serialized_drug).to eq({:data=>{:id=>drug.id.to_s, :type=>:drug, :attributes=>{:name=>drug.name, :description=>drug.description}}})
  end
end
