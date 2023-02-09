require 'rails_helper'

RSpec.describe UserSerializer, type: :serializer do
  let (:user) { create(:patient) }

  it "Should return exact" do
    serialized_user = UserSerializer.new(user).serializable_hash
    expected = 
    {
      :data=>
        {
          :id=>user.id.to_s, 
          :type=>:user, 
          :attributes=>
            {
              :first_name=>user.first_name, 
              :last_name=>user.last_name, 
              :address=>user.address, 
              :date_of_birth=>user.date_of_birth, 
              :username=>user.username, 
              :email=>user.email, 
              :role_id=>user.role_id
            }
        }
    }

    expect(serialized_user.to_json).to be_json_eql(expected.to_json)
  end

end
