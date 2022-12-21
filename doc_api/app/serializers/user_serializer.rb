class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :first_name, :last_name, :address, :date_of_birth, :username, :email
  has_many :examinations
  # belongs_to :role
end
