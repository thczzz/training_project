class PerscriptionSerializer
  include JSONAPI::Serializer
  attributes :id, :description

  # attribute :examination do |obj|
  #   ExaminationSerializer.new(obj.examination)
  # end

  attribute :examination, if: Proc.new { |record, params| 
    params && params[:id]
  } do |obj|
    ExaminationSerializer.new(obj.examination)
  end

  attribute :perscription_drugs, if: Proc.new { |record, params| 
    params && params[:id]
  } do |obj|
    PerscriptionDrugSerializer.new(obj.perscription_drugs, { params: { id: '' }})
  end

end