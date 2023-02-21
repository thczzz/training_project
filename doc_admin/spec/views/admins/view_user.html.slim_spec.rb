require "rails_helper"

RSpec.describe "admins/view_user", type: :view do
  let(:admin_user) { create(:admin) }
  let(:patient_role) { create(:patient_role) }
  let(:doc_role)     { create(:doctor_role) }

  before do
    assign(:resource, admin_user)
    assign(:roles, [doc_role, patient_role])
  end

  it "renders User info" do
    render

    expect(response).to render_template(partial: "devise/shared/_error_messages")

    expect(rendered).to have_selector("h4", text: "#{admin_user.first_name} #{admin_user.last_name}")
    expect(rendered).to have_selector("h6", text: "Joined")
    expect(rendered).to have_selector("h6", text: "Last login")
    expect(rendered).to have_selector("h6", text: "Last login IP")
    expect(rendered).to have_selector("h6", text: "Curr. login IP")
    expect(rendered).to have_selector("h6", text: "Confirmed?")

    expect(response).to render_template(partial: "devise/registrations/_edit")
    expect(rendered).to have_selector("a", text: "Edit")
  end
end
