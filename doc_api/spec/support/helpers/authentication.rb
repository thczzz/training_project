module Helpers
  module Authentication
    def authorize_for_test(user)
      doorkeeper_app = Doorkeeper::Application.create!(name: "React", redirect_uri: "", scopes: "")
      post '/api/v1/oauth/token', params: {
        "grant_type": "password",
        "email": user.email,
        "password": user.password,
        "client_id": doorkeeper_app.uid,
        "client_secret": doorkeeper_app.secret
      }, headers: { 
        'Content-Type' => 'application/json', "Accept" => "application/json" 
      }, as: :json
      
      response.cookies["tokens"]
    end

    def last_email
      ActionMailer::Base.deliveries.last
    end

    def extract_token_from_email(token_name)
      mail_body = last_email.body.to_s
      mail_body[/#{token_name.to_s}_token=([^\>]+)/, 1]
    end
    
  end
end
