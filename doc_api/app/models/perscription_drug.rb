class PerscriptionDrug < ApplicationRecord
  belongs_to :perscription, foreign_key: :perscription_id
  belongs_to :drug,         foreign_key: :drug_id

  validates :perscription_id,   presence: true
  validates :drug_id,           presence: true
  validates :usage_description, presence: true
  validates_uniqueness_of :drug_id, :scope => :perscription_id
end
