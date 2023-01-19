class UserSerializer
  include JSONAPI::Serializer
  attributes :first_name, :last_name, :address, :date_of_birth, :username, :email, :role_id
  # has_many :examinations
  # belongs_to :role
end
