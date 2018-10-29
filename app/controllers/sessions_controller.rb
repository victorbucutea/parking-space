require 'rest-client'
require 'json'
require 'securerandom'

class SessionsController < Devise::SessionsController
  clear_respond_to
  respond_to :json

  def sign_in_fb
    user = params[:user]
    token = user[:token]
    email = user[:email]
    id = user[:id]
    access_token = Rails.application.secrets.fb_app_secret
    url = APP_CONFIG['fb_debug_token_url']

    #validate user token
    response = RestClient.get url, {params: {input_token: token, access_token: access_token}}
    data = JSON.parse response.body

    if id == data['data']['user_id']
      #token belongs to user
      # authenticate user without pw
      user = User.find_by_email(email)

      if user.nil?
        # user is new, he needs to sign up
        # return a status to indicate that we need to redirect to
        # additional info page for the rest of the details
        respond_to do |format|
          format.json { render json: {Error: 'User does not exist'}, status: :unprocessable_entity }
        end
      else
        password = SecureRandom.gen_random 32
        # make user unable to authenticate outside fb
        user.reset_password password ,password
        sign_in :user, user
        respond_to do |format|
          format.json { render json: {Status: "OK",user: user} , status: :created }
        end
      end

    else
      # token does not belong to user
      # return an error
    end
  end

end