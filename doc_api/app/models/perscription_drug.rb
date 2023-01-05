class PerscriptionDrug < ApplicationRecord
  belongs_to :perscription, foreign_key: :perscription_id
  belongs_to :drug,         foreign_key: :drug_id
end