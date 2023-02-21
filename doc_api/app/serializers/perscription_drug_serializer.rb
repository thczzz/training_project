class PerscriptionDrugSerializer
  include JSONAPI::Serializer
  attributes :id, :usage_description
  # has_one   :drug

  attribute :drug, if: proc { |_record, params|
    params && params[:id]
  } do |obj|
    DrugSerializer.new(obj.drug)
  end
end
