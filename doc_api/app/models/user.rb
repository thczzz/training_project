class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :trackable,
         :recoverable, :rememberable, :validatable, :confirmable
  
  has_many :examinations
  belongs_to :role, foreign_key: :role_id

  validates :first_name, :last_name, :address, :date_of_birth, :role_id,
            :username, :email, presence: true
#   validates_associated :role
  validate :date_of_birth_cannot_be_in_the_future

  def date_of_birth_cannot_be_in_the_future
    if date_of_birth.present? && date_of_birth > Date.today
        errors.add(:date_of_birth, "can't be in the future")
    end
  end

end
