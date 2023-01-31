class Role < ApplicationRecord
  validates :name, :description, :created_at, :updated_at, presence: true
end