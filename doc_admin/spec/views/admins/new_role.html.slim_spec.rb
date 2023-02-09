require 'rails_helper'

RSpec.describe "admins/new_role", type: :view do
  before do
    assign(:role, Role.new)
  end

  it "Renders New Drug Form" do
    render

    expect(rendered).to have_selector('input[value="Create Role"]')
    expect(rendered).to have_selector('input[placeholder="example: doctor"]')
    expect(rendered).to have_selector('textarea[placeholder="Enter a meaningful description"]')
    expect(rendered).to match(/Create new Role/)
  end
end
