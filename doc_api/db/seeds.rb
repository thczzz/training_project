# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

if Doorkeeper::Application.count.zero?
  Doorkeeper::Application.create!(name: "React", redirect_uri: "", scopes: "")
  # Doorkeeper::Application.create!(name: "iOS Client", redirect_uri: "", scopes: "")
end

Role.first_or_create(
  name: "admin",
  description: "Admin role"
)

User.first_or_create(
    email: "echonykrom@protonmail.com",
    password: "123456",
    password_confirmation: "123456",
    role_id: 1,
    first_name: "Petar",
    last_name: "K",
    username: "echonykrom",
    date_of_birth: Date.today,
    address: "Stara Zagora"
)