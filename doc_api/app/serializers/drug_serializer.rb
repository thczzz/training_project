class DrugSerializer
  include JSONAPI::Serializer
  attributes :name, :description
end