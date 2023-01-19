class Examination < ApplicationRecord
  has_many :perscriptions
  belongs_to :user

  validates :weight_kg, :height_cm, numericality: true
end