require 'webpush'

module NotificationApi
  extend ActiveSupport::Concern
  def send_notification(destination_user, data)

    return unless destination_user.notif_approved or current_user.notif_registration_id.nil?

    url = destination_user.notif_registration_id

    # build http request and send
    begin
      Webpush.payload_send(
          message: data,
          endpoint: url,
          p256dh: destination_user.p256dh ,
          auth: destination_user.notif_auth,
          vapid: {
              subject: "mailto:sender@example.com",
              public_key: ENV['WEBPUSH_PUBLIC_KEY'],
              private_key: ENV['WEBPUSH_KEY']
          }
      )
    rescue => e
      logger.error e.message
      logger.error e.backtrace.join("\n")
    end
  end
end