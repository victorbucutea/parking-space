json.extract! sensor, :id, :deviceid, :location_text, :title_message,
              :lat, :lng, :snapshot, :installation_date, :hook_active, :active,
              :module_info , :created_at, :updated_at
json.url sensor_url(sensor, format: :json)
