class Perscription < ApplicationRecord
  has_many :perscription_drugs
#   has_many :drugs, through: :perscription_drugs
  belongs_to  :examination, foreign_key: :examination_id
end