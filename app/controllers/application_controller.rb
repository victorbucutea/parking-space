class ApplicationController < ActionController::Base

  # force Current.user to be available asa thread safe variable
  around_action :set_current_user
  def set_current_user
    Current.user = current_user
    yield
  ensure
    # to address the thread variable leak issues in Puma/Thin webserver
    Current.user = nil
  end

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session,  only: Proc.new { |c| c.request.format.json? }

  rescue_from CanCan::AccessDenied do |exception|
    render json: { Error: { general: 'Actiune neautorizata' } }, status: :forbidden
  end

end
