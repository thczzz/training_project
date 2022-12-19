class User < ApplicationRecord
  devise :database_authenticatable, :rememberable, :registerable, :trackable
  paginates_per 6

  has_many :examinations
  belongs_to :role, foreign_key: :role_id

  validates :first_name, :last_name, :address, :date_of_birth, :role_id,
            :username, :email, presence: true
  validates :role_id, numericality: { only_integer: true }
  validates :username, :email, uniqueness: true
  validate  :date_of_birth_cannot_be_in_the_future

  def date_of_birth_cannot_be_in_the_future
    if date_of_birth.present? && date_of_birth > Date.today
        errors.add(:date_of_birth, "can't be in the future")
    end
  end

end
