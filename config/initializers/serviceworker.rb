Rails.application.configure do
  config.serviceworker.routes.draw do
    match "/sw.js"
  end

  config.public_file_server.enabled = true
end