require 'rails_helper'

RSpec.describe Examination, type: :model do
  # Columns
  it { is_expected.to have_db_column(:id).of_type(:integer) }
  it { is_expected.to have_db_column(:user_id).of_type(:integer) }
  it { is_expected.to have_db_column(:weight_kg).of_type(:float) }
  it { is_expected.to have_db_column(:height_cm).of_type(:float) }
  it { is_expected.to have_db_column(:anamnesis).of_type(:text) }
  it { should belong_to(:user) }
  it { should have_many(:perscriptions) }

  # Validations
  it { should validate_presence_of(:user_id) }
  it { should validate_presence_of(:weight_kg) }
  it { should validate_presence_of(:height_cm) }
  it { should validate_presence_of(:anamnesis) }
  it { should validate_numericality_of(:weight_kg) }
  it { should validate_numericality_of(:height_cm) }
  it { should validate_numericality_of(:user_id).only_integer }

  # Creation
  describe 'Test Creation with Valid/Invalid attrs' do
    let(:user) { create(:patient) }
    let(:examination) { build(:examination, user_id: user.id) }

    context 'with Valid attributes' do
      it 'is valid' do
        expect(examination).to be_valid
      end
    end

    context 'with Invalid attributes' do
      it 'is invalid if user_id is empty' do
        examination.user_id = nil
        expect(examination).to_not be_valid
      end

      it 'is invalid if weight_kg is empty' do
        examination.weight_kg = nil
        expect(examination).to_not be_valid
      end

      it 'is invalid if height_cm is empty' do
        examination.height_cm = nil
        expect(examination).to_not be_valid
      end

      it 'is invalid if anamnesis is empty' do
        examination.anamnesis = nil
        expect(examination).to_not be_valid
      end
    end

  end
end