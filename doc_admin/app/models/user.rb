class User < ApplicationRecord
  devise :database_authenticatable, :rememberable, :registerable, :trackable, :confirmable
  paginates_per 6

  # has_many :examinations
  belongs_to :role

  validates :date_of_birth, presence: true
  validates :first_name,    presence: true, length: { maximum: 40 }
  validates :last_name,     presence: true, length: { maximum: 40 }
  validates :address,       presence: true, length: { maximum: 255 }
  validates :role_id,       presence: true, numericality: { only_integer: true }
  validates :username,      presence: true, length: { maximum: 16 }, uniqueness: true
  validates :email,         presence: true, length: { maximum: 60 }, uniqueness: true, format: URI::MailTo::EMAIL_REGEXP
  validate  :date_of_birth_cannot_be_in_the_future

  def date_of_birth_cannot_be_in_the_future
    return unless date_of_birth.present? && date_of_birth > Date.today

    errors.add(:date_of_birth, "can't be in the future")
  end
end
