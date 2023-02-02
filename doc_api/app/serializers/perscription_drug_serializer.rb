class PerscriptionDrugSerializer
  include JSONAPI::Serializer
  attributes :id, :usage_description
  # has_one   :drug

  attribute :drug, if: Proc.new { |record, params| 
    params && params[:id]
  } do |obj|
    DrugSerializer.new(obj.drug)
  end
end
