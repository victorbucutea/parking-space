
class SessionsController < Devise::SessionsController
  clear_respond_to
  respond_to :json
  after_filter :after_login, :only => :create


  def after_login
    if session[:notif_registration_id]
      current_user.update_attribute(:notif_registration_id, session[:notif_registration_id])
    end
  end
end