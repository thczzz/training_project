class Drug < ApplicationRecord
  validates :name,        presence: true, length: { maximum: 125 }
  validates :description, presence: true, length: { maximum: 255 }
end
