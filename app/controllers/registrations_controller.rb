# frozen_string_literal: true

class RegistrationsController < Devise::RegistrationsController
  include SmsApi

  clear_respond_to
  respond_to :json

  before_action :configure_permitted_parameters

  def create
    super
    unless resource.id.nil?
      send_sms(resource.phone_with_prefix,
               "Bine ai venit #{resource.full_name}! Codul tau de confirmare este: '#{resource.phone_confirm_code}'")
    end
  end

  protected

  # my custom fields are :full_name, :phone_number,
  # :country
  def configure_permitted_parameters
    permitted = %i[full_name license phone_number country
                   email password password_confirmation prefix image image_name]
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
