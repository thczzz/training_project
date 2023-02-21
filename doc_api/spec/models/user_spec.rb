require "rails_helper"

RSpec.describe User, type: :model do
  before(:each) { create(:patient) }

  # Columns
  it { is_expected.to have_db_column(:id).of_type(:integer) }
  it { is_expected.to have_db_column(:first_name).of_type(:string) }
  it { is_expected.to have_db_column(:last_name).of_type(:string) }
  it { is_expected.to have_db_column(:address).of_type(:string) }
  it { is_expected.to have_db_column(:date_of_birth).of_type(:date) }
  it { is_expected.to have_db_column(:role_id).of_type(:integer) }
  it { is_expected.to have_db_column(:username).of_type(:string) }
  it { is_expected.to have_db_column(:email).of_type(:string) }
  it { is_expected.to have_db_column(:encrypted_password).of_type(:string) }
  it { is_expected.to have_db_column(:reset_password_token).of_type(:string) }
  it { is_expected.to have_db_column(:reset_password_sent_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:remember_created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:sign_in_count).of_type(:integer) }
  it { is_expected.to have_db_column(:current_sign_in_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:last_sign_in_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:current_sign_in_ip).of_type(:string) }
  it { is_expected.to have_db_column(:last_sign_in_ip).of_type(:string) }
  it { is_expected.to have_db_column(:confirmation_token).of_type(:string) }
  it { is_expected.to have_db_column(:confirmed_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:confirmation_sent_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:unconfirmed_email).of_type(:string) }
  it { is_expected.to have_db_column(:created_at).of_type(:datetime) }
  it { is_expected.to have_db_column(:updated_at).of_type(:datetime) }
  it { should have_db_index(:confirmation_token).unique(true) }
  it { should have_db_index(:email).unique(true) }
  it { should have_db_index(:reset_password_token).unique(true) }
  it { should have_db_index(:role_id).unique(false) }
  it { should have_db_index(:username).unique(true) }
  it { should belong_to(:role) }
  it { should have_many(:examinations) }

  # Validations
  it { should validate_confirmation_of(:password) }
  it { should validate_presence_of(:first_name) }
  it { should validate_presence_of(:last_name) }
  it { should validate_presence_of(:address) }
  it { should validate_presence_of(:date_of_birth) }
  it { should validate_presence_of(:role_id) }
  it { should validate_presence_of(:username) }
  it { should validate_presence_of(:email) }
  it { should validate_uniqueness_of(:username).ignoring_case_sensitivity }
  it { should validate_uniqueness_of(:email).ignoring_case_sensitivity }
  it { should validate_numericality_of(:role_id).only_integer }
  it { should validate_length_of(:username).is_at_most(16) }
  it { should validate_length_of(:first_name).is_at_most(40) }
  it { should validate_length_of(:last_name).is_at_most(40) }
  it { should validate_length_of(:email).is_at_most(60) }
  it { should validate_length_of(:address).is_at_most(255) }

  describe "Validates date_of_birth with date_of_birth_cannot_be_in_the_future" do
    context "with invalid attribute" do
      it "is not valid with date_of_birth in the future" do
        expect(build(:patient, date_of_birth: 2.days.from_now)).to_not be_valid
      end
    end

    context "with valid attribute" do
      it "is valid with date_of_birth in the past" do
        expect(build(:patient, date_of_birth: 2.days.ago)).to be_valid
      end
    end
  end

  # Creation
  describe "Test Creation with Valid/Invalid attrs" do
    let(:user) { FactoryBot.build(:patient) }

    context "with Valid attributes" do
      it "is valid" do
        expect(user).to be_valid
      end
    end

    context "with invalid attributes" do
      it "is not valid without first_name" do
        user.first_name = nil
        expect(user).to_not be_valid
      end
      it "is not valid without last_name" do
        user.last_name = nil
        expect(user).to_not be_valid
      end
      it "is not valid without address" do
        user.address = nil
        expect(user).to_not be_valid
      end
      it "is not valid without date_of_birth" do
        user.date_of_birth = nil
        expect(user).to_not be_valid
      end
      it "is not valid without role_id" do
        user.role_id = nil
        expect(user).to_not be_valid
      end
      it "is not valid without username" do
        user.username = nil
        expect(user).to_not be_valid
      end
      it "is not valid without email" do
        user.email = nil
        expect(user).to_not be_valid
      end
      it "is not valid without password" do
        user.password = nil
        expect(user).to_not be_valid
      end
      it "is not valid without password_confirmation" do
        user.password_confirmation = ""
        expect(user).to_not be_valid
      end
      it "is not valid if passwords do not match" do
        user.password = "123456789"
        expect(user).to_not be_valid
      end
      it "is not valid if password less than 6 chars" do
        user.password = "12345"
        user.password_confirmation = "12345"
        expect(user).to_not be_valid
      end
    end
  end

  # Class methods
  describe "test self.authenticate(email, password) method" do
    let(:user) { User.first }

    context "with Valid attributes" do
      it "is valid" do
        expect(User.authenticate(user.email, "123456")).to eq user
      end
    end

    context "with Invalid attributes" do
      it "is invalid" do
        expect(User.authenticate(user.email, "12345")).to eq nil
      end
    end
  end

  # Instance methods
end
