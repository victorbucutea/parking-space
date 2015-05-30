class RegistrationsController < Devise::RegistrationsController
  clear_respond_to
  respond_to :json

  before_filter :configure_permitted_parameters

  protected

  # my custom fields are :name, :heard_how
  def configure_permitted_parameters
    permitted = [:full_name, :phone_number, :country, :email, :password, :password_confirmation]
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


end