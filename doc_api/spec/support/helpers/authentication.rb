module Helpers
  module Authentication
    def authorize_for_test(user)
      if Doorkeeper::Application.count.zero?
        Doorkeeper::Application.create!(name: "React", redirect_uri: "", scopes: "")
      else
        Doorkeeper::Application.first
      end

      post "/api/v1/oauth/token", params: {
        "grant_type": "password",
        "email": user.email,
        "password": user.password
      }, headers: {
        "Content-Type" => "application/json", "Accept" => "application/json"
      }, as: :json

      response.cookies["tokens"]
    end

    def last_email
      ActionMailer::Base.deliveries.last
    end

    def extract_token_from_email(token_name)
      mail_body = last_email.body.to_s
      mail_body[/#{token_name}_token=([^\>]+)/, 1]
    end
  end
end
