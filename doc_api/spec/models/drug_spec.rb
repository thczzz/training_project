require 'rails_helper'

RSpec.describe Drug, type: :model do
  # Columns
  it { is_expected.to have_db_column(:name).of_type(:string) }
  it { is_expected.to have_db_column(:description).of_type(:text) }
  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }

  # Validations
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:description) }

end