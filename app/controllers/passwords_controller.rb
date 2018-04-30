class PasswordsController < Devise::PasswordsController
  respond_to :json

  def after_resetting_password_path_for(resource)
    done_user_password_path(resource)
  end

  # PUT /users/password/done
  def done
  end


end