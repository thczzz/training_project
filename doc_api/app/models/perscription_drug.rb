class PerscriptionDrug < ApplicationRecord
  belongs_to :perscription, foreign_key: :perscription_id
  belongs_to :drug,         foreign_key: :drug_id

  validates_uniqueness_of :drug_id, :scope => :perscription_id
  validates :perscription_id, :drug_id, :usage_description, presence: true
end
