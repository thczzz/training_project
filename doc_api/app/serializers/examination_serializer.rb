class ExaminationSerializer
  include JSONAPI::Serializer
  attributes :id, :weight_kg, :height_cm, :anamnesis, :created_at

  attribute :perscriptions, if: Proc.new { |record, params| 
    params && params[:id]
  } do |obj|
    PerscriptionSerializer.new(obj.perscriptions, { params: { id: '' }})
  end

  # belongs_to :user
  # has_one :perscription
end
