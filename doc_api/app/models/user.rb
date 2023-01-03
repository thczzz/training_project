class User < ApplicationRecord

  devise :database_authenticatable, :registerable, 
         :trackable, :recoverable, :validatable, :confirmable
  
  has_many :examinations
  belongs_to :role, foreign_key: :role_id

  validates :first_name, :last_name, :address, :date_of_birth, :role_id,
            :username, :email, presence: true
  validates :username, :email, uniqueness: true
  validates :email, format: URI::MailTo::EMAIL_REGEXP
  validates :role_id, numericality: { only_integer: true }

  validate  :date_of_birth_cannot_be_in_the_future

  def self.authenticate(email, password)
    user = User.find_for_authentication(email: email)
    user&.valid_password?(password) ? user : nil
  end

  def revoke_user_token
    Doorkeeper::AccessToken.by_resource_owner(self).where(revoked_at: nil).update_all(revoked_at: Time.now.utc)
  end

  def date_of_birth_cannot_be_in_the_future
    if date_of_birth.present? && date_of_birth > Date.today
        errors.add(:date_of_birth, "can't be in the future")
    end
  end

end
