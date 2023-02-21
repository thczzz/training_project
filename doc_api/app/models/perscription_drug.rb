class PerscriptionDrug < ApplicationRecord
  belongs_to :perscription
  belongs_to :drug

  validates :perscription_id,   presence: true
  validates :drug_id,           presence: true
  validates :usage_description, presence: true
  validates :drug_id, uniqueness: { scope: :perscription_id }
end
