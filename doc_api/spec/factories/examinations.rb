FactoryBot.define do
  factory :examination do
    association :user, factory: :patient
    weight_kg  { Faker::Number.decimal(l_digits: 2) }
    height_cm  { Faker::Number.decimal(l_digits: 2) }
    anamnesis  { Faker::Lorem.sentence }
    created_at { Time.now }
    updated_at { Time.now }
  end
end
