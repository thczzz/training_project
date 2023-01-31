require 'rails_helper'


RSpec.describe Role, type: :model do
  # Columns
  it { is_expected.to have_db_column(:id).of_type(:integer) }
  it { is_expected.to have_db_column(:name).of_type(:string) }
  it { is_expected.to have_db_column(:description).of_type(:text) }
  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }

  # Validations
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:description) }
  it { should validate_presence_of(:created_at) }
  it { should validate_presence_of(:updated_at) }

  # Creation with Valid attributes
  context 'with valid attributes' do
    it 'is valid with valid attributes' do
      expect(create(:admin_role)).to be_valid
    end
  end


  # Creation with Invalid attributes
  context 'with valid attributes' do
    it 'is not valid with empty description' do
      expect(build(:admin_role, description: nil)).to_not be_valid
    end
  end

end
