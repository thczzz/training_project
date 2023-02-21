FactoryBot.define do
  factory :user do
    association :role, factory: :admin_role
    sequence(:username)   { |n| "user_#{n}" }
    first_name            { Faker::Name.first_name }
    last_name             { Faker::Name.last_name }
    address               { "Stara Zagora" }
    date_of_birth         { Faker::Date.backward(days: 365) }
    email                 { Faker::Internet.unique.email }
    password              { "123456" }
    password_confirmation { "123456" }
    confirmed_at          { Time.now }
    created_at            { Time.now }
    updated_at            { Time.now }

    factory :admin do
      role_id { 1 }
    end

    factory :doctor do
      role_id { 2 }
    end

    factory :patient do
      role_id { 3 }
    end
  end
end
