require 'rails_helper'

RSpec.describe "devise/registrations/new", type: :view do
  let(:patient_role) { create(:patient_role) }
  let(:doc_role)     { create(:doctor_role) }

  before do
    without_partial_double_verification do
      allow(view).to receive(:resource).and_return(User.new)
      allow(view).to receive(:resource_name).and_return(:user)
      allow(view).to receive(:devise_mapping).and_return(Devise.mappings[:user])
    end
    assign(:roles, [doc_role, patient_role])
  end

  it "Renders User Creation Form" do
    render

    expect(response).to render_template(partial: "devise/shared/_error_messages")
    expect(rendered).to have_selector('h2', text: "Register a new user")

    expect(rendered).to have_selector('label', text: "Username")
    expect(rendered).to have_selector('input[type="text"][name="user[username]"]')
    expect(rendered).to have_selector('label', text: "Email")
    expect(rendered).to have_selector('input[type="email"][name="user[email]"]')
    expect(rendered).to have_selector('label', text: "Password")
    expect(rendered).to have_selector('input[type="password"][name="user[password]"]')
    expect(rendered).to have_selector('label', text: "Password confirmation")
    expect(rendered).to have_selector('input[type="password"][name="user[password_confirmation]"]')
    expect(rendered).to have_selector('label', text: "First name")
    expect(rendered).to have_selector('input[type="text"][name="user[first_name]"]')
    expect(rendered).to have_selector('label', text: "Last name")
    expect(rendered).to have_selector('input[type="text"][name="user[last_name]"]')
    expect(rendered).to have_selector('label', text: "Address")
    expect(rendered).to have_selector('input[type="text"][name="user[address]"]')
    expect(rendered).to have_selector('label', text: "Date of birth")
    expect(rendered).to have_selector('input[type="date"][name="user[date_of_birth]"]')
    expect(rendered).to have_selector('label', text: "Role")
    expect(rendered).to have_selector('select[name="user[role_id]"]')

    expect(rendered).to have_selector('input[value="Register the User"][type="submit"]')
  end
end
