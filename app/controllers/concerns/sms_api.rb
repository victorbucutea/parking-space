require 'swagger_client'

module SmsApi
  extend ActiveSupport::Concern

  def initialize
    SwaggerClient.configure do |config|
      config.host = 'api.thesmsworks.co.uk'
      # Configure API key authorization: JWT
      config.api_key['Authorization'] = Rails.application.secrets.sms_auth_token
      # Uncomment the following line to set a prefix for the API key, e.g. 'Bearer' (defaults to nil)
      config.api_key_prefix['Authorization'] = 'JWT'
    end
    @sms_api = SwaggerClient::MessagesApi.new
  end

  def send_sms(destination_no, text)
    sms_message = SwaggerClient::Message.new # Message | Message properties
    sms_message.sender = "GoPark"
    sms_message.destination = destination_no.sub '+', ''
    sms_message.content = text
    sms_message.schedule = ""
    sms_message.tag = "offers"
    begin
      @sms_api.send_message(sms_message)
    rescue SwaggerClient::ApiError => e
      puts "Exception when sending SMS : #{e} , #{e.response_body}"
    end
  end
end