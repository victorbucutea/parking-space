json.extract! sensor, :id, :deviceid, :location_text, :title_message,
              :lat, :lng, :snapshot, :installation_date, :hook_active, :active,
              :module_info , :created_at, :updated_at, :last_touch_date
json.url sensor_url(sensor, format: :json)
