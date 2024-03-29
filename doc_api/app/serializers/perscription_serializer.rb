class PerscriptionSerializer
  include JSONAPI::Serializer
  attributes :id, :description, :created_at

  attribute :perscription_drugs, if: proc { |_record, params|
    params && params[:id]
  } do |obj|
    PerscriptionDrugSerializer.new(obj.perscription_drugs, { params: { id: "" } })
  end
end
