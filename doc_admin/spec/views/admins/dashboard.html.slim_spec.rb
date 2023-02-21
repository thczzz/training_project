require "rails_helper"

RSpec.describe "admins/dashboard", type: :view do
  let!(:patient_role) { create(:patient_role) }
  let!(:doc_role)     { create(:doctor_role) }
  let!(:patient_user) { create(:patient, role_id: patient_role.id) }
  let!(:doc_user)     { create(:doctor, role_id: doc_role.id) }
  let!(:admin_user)   { create(:admin) }

  before do
    assign(:users, Kaminari.paginate_array([patient_user, doc_user, admin_user]).page(1).per(1))
    assign(:roles, [doc_role, patient_role])
  end

  it "Displays Paginated Table with Users" do
    render

    expect(rendered).to match(/Filter by account role/)

    expect(rendered).to have_selector("tr>th", text: "ID")
    expect(rendered).to have_selector("tr>th", text: "Username")
    expect(rendered).to have_selector("tr>th", text: "First Name")
    expect(rendered).to have_selector("tr>th", text: "Last Name")
    expect(rendered).to have_selector("tr>th", text: "Acc. Role")
    expect(rendered).to have_selector("tr>th", text: "Email")
    expect(rendered).to have_selector("tr>th", text: "Actions")

    expect(rendered).to have_selector("tr>th", text: patient_user.id)
    expect(rendered).to have_selector("tr>td", text: patient_user.username)
    expect(rendered).to have_selector("tr>td", text: patient_user.first_name)
    expect(rendered).to have_selector("tr>td", text: patient_user.last_name)
    expect(rendered).to have_selector("tr>td", text: patient_user.role.name)
    expect(rendered).to have_selector("tr>td", text: patient_user.email)
    expect(rendered).to have_selector('tr>td>a[class="btn btn-info"]', text: "View")
    expect(rendered).to have_selector('tr>td>a[class="btn btn-warning"]', text: "Edit")
    expect(rendered).to have_selector('tr>td>a[class="btn btn-danger"]', text: "Delete")

    expect(rendered).to have_selector('li>a[class="page-link"][rel="next"]', text: "Next ")
  end
end
