class Role < ApplicationRecord
  validates :name,        presence: true, length: { maximum: 90 }
  validates :description, presence: true, length: { maximum: 255 }
end
