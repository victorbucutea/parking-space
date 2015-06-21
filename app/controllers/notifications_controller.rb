class NotificationsController < ApplicationController


  def notif
    if  params[:notif_registration_id]
      current_user.update( notif_registration_id:  params[:notif_registration_id] );
    end
  end



end