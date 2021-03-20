class UsersController < ApplicationController

  include SmsApi

  before_action :authenticate_user!
  load_and_authorize_resource


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
    render json: { message: 'OK' }, status: 200 if current_user.save
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
    @users = if params[:id]
               [User.includes(:roles).find(params[:id])]
             elsif params[:query]
               User.includes(:roles).with_name(params[:query])
             else
               []
             end
  end

  def attach_images
    imgs = params[:images]

    current_user.images.destroy_all
    # save to parking_space_documents
    imgs.each do |d|
      img = current_user.images.create(image: d[:file], name: d[:name], comment: 'User upload')
      unless img.errors.empty?
        return render json: { Error: img.errors }, status: :unprocessable_entity
      end
    end

    render :edit, status: :created
  end

  def random_str
    (0...4).map { ('a'..'z').to_a[rand(26)] }.join
  end
end