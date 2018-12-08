require 'rest-client'
require 'json'
require 'securerandom'

class SessionsController < Devise::SessionsController
  clear_respond_to
  respond_to :json

  def sign_in_fb
    token = params[:user][:token]
    access_token = Rails.application.secrets.fb_app_secret
    url = APP_CONFIG['fb_graph_me_url']

    #validate user token
    response = RestClient.get url, {params: {fields: 'id,name,email', access_token: token}}
    data = JSON.parse response.body

    email = data['email']
    name = data['name']
    id = data['id']

    #token belongs to user
    # authenticate user without pw
    user = User.find_by_email(email)

    if user.nil?
      # user is new, he needs to sign up
      # return a status to indicate that we need to redirect to
      # additional info page for the rest of the details
      respond_to do |format|
        format.json {render json: {Error: 'User does not exist',
                                   email: email,
                                   id: id,
                                   name: name},
                            status: :unprocessable_entity}
      end
    else
      password = ('a'..'Z').to_a.shuffle[0, 34].join
      # make user unable to authenticate outside fb
      user.reset_password password, password
      sign_in :user, user
      respond_to do |format|
        format.json {render json: {Status: 'OK', user: user}, status: :created}
      end
    end

  end

end