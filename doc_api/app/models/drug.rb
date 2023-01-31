class Drug < ApplicationRecord
  validates :name, :description, presence: true
end
