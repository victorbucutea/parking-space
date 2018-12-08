class SensorAuthController < ApplicationController
  # before_action :authenticate_user!


  # POST
  def authenticate
    pusher_client = Pusher::Client.new(
      app_id: ENV['PUSHER_APP_ID'],
      key: ENV['PUSHER_KEY'],
      secret: ENV['PUSHER_SECRET'],
      cluster: 'eu'
    )

    # if current_user
    response = pusher_client.authenticate(params[:channel_name], params[:socket_id])
    render json: response
    # else
    #   render text: 'Forbidden', status: '403'
  end
end
