require 'rails_helper'

RSpec.describe PerscriptionDrug, type: :model do
  # Columns
  it { is_expected.to_not have_db_column(:id) }
  it { is_expected.to have_db_column(:perscription_id).of_type(:integer) }
  it { is_expected.to have_db_column(:drug_id).of_type(:integer) }
  it { is_expected.to have_db_column(:usage_description).of_type(:text) }

  # Validations
  it { should validate_presence_of(:drug_id) }
  it { should validate_presence_of(:perscription_id) }
  it { should validate_presence_of(:usage_description) }
  it { expect(create(:perscription_drug)).to validate_uniqueness_of(:drug_id).ignoring_case_sensitivity.scoped_to(:perscription_id) }

end
