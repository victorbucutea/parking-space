class RegistrationsController < Devise::RegistrationsController
  include SmsApi

  clear_respond_to
  respond_to :json

  before_action :configure_permitted_parameters

  def create
    puts params
    puts sign_up_params
    super
    #send_sms(resource.phone_number,
       #      "Bine ai venit #{resource.full_name}! Codul tau de confirmare este: '#{resource.phone_confirm_code}'")
  end

  def send_new_code
    current_user.phone_number = params[:phone_number]
    current_user.phone_confirm_code = random_str
    current_user.phone_no_confirm = false

    if current_user.save
      send_sms(current_user.phone_number, "Codul de confirmare este: '#{current_user.phone_confirm_code}' ")
      render :edit
    end
  end

  def validate_code
    incoming_cd = params[:phone_validation_code]

    if current_user.phone_confirm_code == incoming_cd
      current_user.phone_no_confirm = true
      if current_user.save
        render :edit
      else
        render json: {Error: 'Cod invalid'}, status: :unprocessable_entity
      end
    else
      render json: {Error: 'Cod invalid'}, status: :unprocessable_entity
    end
  end


  def client_token
    gateway = Braintree::Gateway.new(
        :environment =>  ENV['PAYMENT_ENV'].to_sym,
        :merchant_id => ENV['MERCHANT_ID'],
        :public_key => ENV['MERCHANT_PUB_KEY'],
        :private_key => ENV['MERCHANT_PRIV_KEY'],
    )
    token = gateway.client_token
    if current_user.payment_id.nil?
      token_str = token.generate
    else
      token_str = token.generate :customer_id => current_user.payment_id
    end
    render json: {token: token_str}
  end


  protected

# my custom fields are :full_name, :phone_number,
# :country, :notif_registration_id
  def configure_permitted_parameters
    permitted = [:full_name, :license, :phone_number, :phone_validation_code, :country, :email, :password, :password_confirmation, :notif_registration_id]
    devise_parameter_sanitizer.permit(:sign_up, keys: permitted)
    devise_parameter_sanitizer.permit(:account_update, keys: permitted)
    devise_parameter_sanitizer.permit(:sign_in, keys: permitted)
  end

#Override default update because it required a password
  def update_resource(resource, params)
    resource.update(params)
  end

  def build_resource(hash)
    super hash
    resource.phone_confirm_code = random_str
  end

  def random_str
    (0...4).map {('a'..'z').to_a[rand(26)]}.join
  end

end