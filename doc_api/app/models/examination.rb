class Examination < ApplicationRecord
  has_many :perscriptions
  belongs_to :user

  validates :weight_kg, :height_cm, numericality: true
  validates :user_id, :weight_kg, :height_cm, :anamnesis, presence: true
  validates :user_id, numericality: { only_integer: true }
end
