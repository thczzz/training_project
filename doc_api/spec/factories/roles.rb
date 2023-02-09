FactoryBot.define do
  factory :role do
    description {"role description"}
    created_at { Time.now }
    updated_at { Time.now }

    factory :admin_role do
      id { 1 }
      name {"admin"}
    end

    factory :doctor_role do
      id { 2 }
      name {"doctor"}
    end

    factory :patient_role do
      id { 3 }
      name {"patient"}
    end
  end
end
