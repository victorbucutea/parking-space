# frozen_string_literal: true

class RegistrationsController < Devise::RegistrationsController
  include SmsApi

  clear_respond_to
  respond_to :json

  before_action :configure_permitted_parameters

  def create
    super
    unless resource.id.nil?
      send_sms(resource.phone_number,
               "Bine ai venit #{resource.full_name}! Codul tau de confirmare este: '#{resource.phone_confirm_code}'")
    end
  end

  def send_new_code
    current_user.phone_number = params[:phone_number]
    current_user.prefix = params[:prefix]
    current_user.phone_confirm_code = random_str
    current_user.phone_no_confirm = false

    if current_user.save
      send_sms(current_user.phone_with_prefix,
               "'#{current_user.phone_confirm_code}' este codul de confirmare (Go-park.ro).")
      render :edit
    end
  end

  def register_for_notifications
    current_user.notif_registration_id = params[:endpoint]
    current_user.notif_approved = params[:notif_approved]
    unless params[:keys].nil?
      current_user.notif_auth = params[:keys][:auth]
      current_user.p256dh = params[:keys][:p256dh]
    end
    render json: {message: 'OK'}, status: 200 if current_user.save
  end

  def validate_code
    incoming_cd = params[:phone_validation_code]

    if current_user.phone_confirm_code == incoming_cd
      current_user.phone_no_confirm = true
      if current_user.save
        render :edit
      else
        render json: { Error: 'Cod invalid' }, status: :unprocessable_entity
      end
    else
      render json: { Error: 'Cod invalid' }, status: :unprocessable_entity
    end
  end

  def client_token
    gateway = Braintree::Gateway.new(
        environment: ENV['PAYMENT_ENV'].to_sym,
        merchant_id: ENV['MERCHANT_ID'],
        public_key: ENV['MERCHANT_PUB_KEY'],
        private_key: ENV['MERCHANT_PRIV_KEY']
    )
    token = gateway.client_token
    token_str = if current_user.payment_id.nil?
                  token.generate
                else
                  token.generate customer_id: current_user.payment_id
                end
    render json: { token: token_str }
  end

  def list
    if params[:query].nil?
      @users = []
    else
      # return employees of current user company
      @users = User.includes(:roles).with_name(params[:query])
    end

  end

  protected

  # my custom fields are :full_name, :phone_number,
  # :country
  def configure_permitted_parameters
    permitted = %i[full_name license phone_number country
                  email password password_confirmation prefix image]
    devise_parameter_sanitizer.permit(:sign_up, keys: permitted)
    devise_parameter_sanitizer.permit(:account_update, keys: permitted)
    devise_parameter_sanitizer.permit(:sign_in, keys: permitted)
  end

  # Override default update because it required a password
  def update_resource(resource, params)
    resource.update(params)
  end

  def build_resource(hash)
    super hash
    resource.phone_confirm_code = random_str
  end

  def random_str
    (0...4).map { ('a'..'z').to_a[rand(26)] }.join
  end

end