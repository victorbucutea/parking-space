class RegistrationsController < Devise::RegistrationsController
  clear_respond_to
  respond_to :json

  before_filter :configure_permitted_parameters


  protected

  # my custom fields are :full_name, :phone_number, :country, :notif_registration_id
  def configure_permitted_parameters
    permitted = [:full_name, :phone_number, :country, :email, :password, :password_confirmation, :notif_registration_id]
    devise_parameter_sanitizer.for(:sign_up) do |u|
      u.permit(*permitted)
    end
    devise_parameter_sanitizer.for(:account_update) do |u|
      u.permit(*permitted)
    end
    devise_parameter_sanitizer.for(:sign_in) do |u|
      u.permit(*permitted)
    end
  end

  #Override default update because it required a password
  def update_resource(resource, params)
    resource.update(params)
  end


end