class Examination < ApplicationRecord
  has_many :perscriptions
  belongs_to :user

  validates :user_id,   presence: true, numericality: { only_integer: true }
  validates :weight_kg, presence: true, numericality: true
  validates :height_cm, presence: true, numericality: true
  validates :anamnesis, presence: true
end
