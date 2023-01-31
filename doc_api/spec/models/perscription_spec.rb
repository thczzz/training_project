require 'rails_helper'

RSpec.describe Perscription, type: :model do
  # Columns
  it { is_expected.to have_db_column(:id).of_type(:integer) }
  it { is_expected.to have_db_column(:examination_id).of_type(:integer) }
  it { is_expected.to have_db_column(:description).of_type(:text) }
  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { should belong_to(:examination) }
  it { should have_many(:perscription_drugs) }

  # Validations
  it { should validate_presence_of(:examination_id) }
  it { should validate_presence_of(:description) }
  it { should validate_numericality_of(:examination_id).only_integer }

end