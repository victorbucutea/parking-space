class NotificationsController < ApplicationController


  def notif
    if params[:notif_registration_id]
      session[:notif_registration_id] = params[:notif_registration_id]
      if current_user == nil
        return
      end
      current_user.notif_registration_id = params[:notif_registration_id]
      if current_user.save
        render json: {status: "OK"}, status: :created
      else
        render json: {Error: {general: "Registration ID"}}, status: :unprocessable_entity
      end
    else
      render json: {Error: {general: "Registration ID"}}, status: :unprocessable_entity
    end

  end


end