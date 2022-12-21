class ExaminationSerializer
  include JSONAPI::Serializer
  attributes :id, :weight_kg, :height_cm, :anamnesis, :created_at
  belongs_to :user
  # has_one :perscription
end
