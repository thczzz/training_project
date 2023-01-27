FactoryBot.define do
  factory :perscription do
    association :examination, factory: :examination
    description { Faker::Lorem.sentence }
  end
end
