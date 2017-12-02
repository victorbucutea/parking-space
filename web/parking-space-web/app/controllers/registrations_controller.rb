class RegistrationsController < Devise::RegistrationsController
  clear_respond_to
  respond_to :json

  before_action :configure_permitted_parameters

  protected

  # my custom fields are :full_name, :phone_number,
  # :country, :notif_registration_id
  def configure_permitted_parameters
    permitted = [:full_name, :license, :phone_number, :country, :email, :password, :password_confirmation, :notif_registration_id]
    devise_parameter_sanitizer.permit(:sign_up, keys: permitted)
    devise_parameter_sanitizer.permit(:account_update, keys: permitted)
    devise_parameter_sanitizer.permit(:sign_in, keys: permitted)
  end

  #Override default update because it required a password
  def update_resource(resource, params)
    resource.update(params)
  end

end