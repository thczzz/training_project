class PerscriptionDrug < ApplicationRecord
  belongs_to :perscription
  belongs_to :drug
end