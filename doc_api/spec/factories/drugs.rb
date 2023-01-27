FactoryBot.define do
  factory :drug do
    sequence(:name) { |n| "drug_#{n}" }
    description     { Faker::Lorem.sentence }
  end
end
