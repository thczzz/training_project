require "rails_helper"

RSpec.describe "devise/sessions/new", type: :view do
  before do
    without_partial_double_verification do
      allow(view).to receive(:resource).and_return(User.new)
      allow(view).to receive(:resource_name).and_return(:user)
      allow(view).to receive(:devise_mapping).and_return(Devise.mappings[:user])
    end
  end

  it "Renders Login Form" do
    render

    expect(response).to render_template(partial: "devise/shared/_error_messages")
    expect(rendered).to have_selector("h2", text: "Log in")

    expect(rendered).to have_selector('input[type="email"]')
    expect(rendered).to have_selector("label", text: "Email")
    expect(rendered).to have_selector('input[type="password"]')
    expect(rendered).to have_selector("label", text: "Password")
    expect(rendered).to have_selector('input[type="checkbox"][name="user[remember_me]"]')
    expect(rendered).to have_selector("label", text: "Remember me")
    expect(rendered).to have_selector('input[value="Log in"][type="submit"]')
  end
end
