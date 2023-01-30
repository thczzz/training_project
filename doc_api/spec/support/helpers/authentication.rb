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
  end
end
