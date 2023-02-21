class Perscription < ApplicationRecord
  has_many    :perscription_drugs
  belongs_to  :examination

  validates :examination_id, presence: true, numericality: { only_integer: true }
  validates :description,    presence: true
end
