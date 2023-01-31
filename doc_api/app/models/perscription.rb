class Perscription < ApplicationRecord
  has_many :perscription_drugs
  belongs_to  :examination, foreign_key: :examination_id

  validates :examination_id, :description, presence: true
  validates :examination_id, numericality: { only_integer: true }
end
