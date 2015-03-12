json.extract! @message, :id, :proposal_id, :content, :created_at
json.owner_is_current_user @message.deviceid == session[:deviceid]

