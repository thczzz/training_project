class Examination < ApplicationRecord
  has_one :perscription
  belongs_to :user

  validates :weight_kg, :height_cm, numericality: true
end