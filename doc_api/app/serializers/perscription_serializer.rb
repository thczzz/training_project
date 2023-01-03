class PerscriptionSerializer
  include JSONAPI::Serializer
  attributes :id, :description
  belongs_to :examination
end