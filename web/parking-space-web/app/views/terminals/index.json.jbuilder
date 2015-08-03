json.array!(@terminals) do |terminal|
  json.extract! terminal, :id, :email, :notif_registration_id
  json.url terminal_url(terminal, format: :json)
end
