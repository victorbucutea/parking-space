# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
Rails.application.initialize!


Rails.application.configure do

  config.to_prepare { Devise::SessionsController.force_ssl }
  config.to_prepare { Devise::RegistrationsController.force_ssl }
  config.to_prepare { Devise::PasswordsController.force_ssl }

  ActionMailer::Base.smtp_settings = {
      :user_name => ENV['SENDGRID_USERNAME'],
      :password => ENV['SENDGRID_PASSWORD'],
      :domain => 'go-park.ro',
      :address => 'smtp.sendgrid.net',
      :port => 587,
      :authentication => :plain,
      :enable_starttls_auto => true
  }

end

