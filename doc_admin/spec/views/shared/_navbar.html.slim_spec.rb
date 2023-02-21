require "rails_helper"

RSpec.describe "shared/_navbar", type: :view do
  it "Renders Navbar" do
    render

    expect(rendered).to have_selector('a[class="navbar-brand"]', text: "Admin Panel")
    expect(rendered).to have_selector("a", text: "Dashboard")
    expect(rendered).to have_selector("a", text: "Menu")
    expect(rendered).to have_selector("li>a", text: "Create new Role")
    expect(rendered).to have_selector("li>a", text: "Create new User")
    expect(rendered).to have_selector("li>a", text: "Add new Drug")
    expect(rendered).to have_selector("li>a", text: "Logout")
    expect(rendered).to have_selector('form[method="get"]')
    expect(rendered).to have_selector('form>input[placeholder="Search User by username"][name="username"]')
    expect(rendered).to have_selector('form>input[value="Search"][type="submit"]')
  end
end
