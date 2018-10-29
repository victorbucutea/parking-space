class PasswordsController < Devise::PasswordsController
  prepend_before_action :logout

  respond_to :json

  def after_resetting_password_path_for(resource)
    done_user_password_path(resource)
  end

  # PUT /users/password/done
  def done
  end


  # GET /resource/password/edit?reset_password_token=abcdef
  def edit
    super
  end

  def logout
    sign_out
  end

end