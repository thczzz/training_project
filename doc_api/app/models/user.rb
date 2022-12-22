class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable, 
         :trackable, :recoverable, :validatable, :confirmable,
         :jwt_authenticatable, jwt_revocation_strategy: self
  
  has_many :examinations
  belongs_to :role, foreign_key: :role_id

  validates :first_name, :last_name, :address, :date_of_birth, :role_id,
            :username, :email, presence: true
  validates :username, :email, uniqueness: true
  validates :role_id, numericality: { only_integer: true }

  validate  :date_of_birth_cannot_be_in_the_future

  def date_of_birth_cannot_be_in_the_future
    if date_of_birth.present? && date_of_birth > Date.today
        errors.add(:date_of_birth, "can't be in the future")
    end
  end

end
