require "rails_helper"

RSpec.describe "admins/new_drug", type: :view do
  before do
    assign(:drug, Drug.new)
  end

  it "Renders New Drug Form" do
    render

    expect(rendered).to have_selector('input[value="Add Drug"]')
    expect(rendered).to have_selector('input[placeholder="example: Aspirin"]')
    expect(rendered).to have_selector('textarea[placeholder="Enter description"]')
    expect(rendered).to match(/Add new Drug/)
  end
end
