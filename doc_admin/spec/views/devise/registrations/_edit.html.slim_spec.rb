require 'rails_helper'

RSpec.describe "devise/registrations/_edit", type: :view do
  let(:user) { create(:user) }
  let(:patient_role) { create(:patient_role) }
  let(:doc_role)     { create(:doctor_role) }

  before do
    without_partial_double_verification do
      allow(view).to receive(:resource).and_return(user)
      allow(view).to receive(:resource_name).and_return(:user)
      allow(view).to receive(:devise_mapping).and_return(Devise.mappings[:user])
    end
    admin_role = Role.find_by(name: "admin")
    assign(:roles, [admin_role, doc_role, patient_role])
  end

  it "Renders User Edit Form" do
    render

    expect(response).to render_template(partial: "devise/shared/_error_messages")

    expect(rendered).to have_selector('label', text: "Email")
    expect(rendered).to have_selector("input[type='email'][name='user[email]'][value='#{user.email}']")
    expect(rendered).to have_selector('label', text: "Username")
    expect(rendered).to have_selector("input[type='text'][name='user[username]'][value='#{user.username}']")
    expect(rendered).to have_selector('label', text: "First name")
    expect(rendered).to have_selector("input[type='text'][name='user[first_name]'][value='#{user.first_name}']")
    expect(rendered).to have_selector('label', text: "Last name")
    expect(rendered).to have_selector("input[type='text'][name='user[last_name]'][value='#{user.last_name}']")
    expect(rendered).to have_selector('label', text: "Address")
    expect(rendered).to have_selector("input[type='text'][name='user[address]'][value='#{user.address}']")
    expect(rendered).to have_selector('label', text: "Date of birth")
    expect(rendered).to have_selector("input[type='date'][name='user[date_of_birth]'][value='#{user.date_of_birth}']")
    expect(rendered).to have_selector('label', text: "Role")
    expect(rendered).to have_selector('select[name="user[role_id]"]')
    expect(rendered).to have_selector("select>option[selected='selected'][value='#{user.role_id}']", text: "#{user.role.name}")
    expect(rendered).to have_selector('label', text: "Password")
    expect(rendered).to have_selector('input[type="password"][name="user[password]"]')
    expect(rendered).to have_selector('label', text: "Password confirmation")
    expect(rendered).to have_selector('input[type="password"][name="user[password_confirmation]"]')
    expect(rendered).to match(/(leave blank if you don't want to change it)/)

    expect(rendered).to have_selector('input[value="Update"][type="submit"]')
    expect(rendered).to have_selector('button[type="submit"]', text: "Cancel")
  end
end
