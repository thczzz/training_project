FactoryBot.define do
  factory :perscription_drug do
    association :perscription, factory: :perscription
    association :drug, factory: :drug
    usage_description { Faker::Lorem.sentence }
  end
end
