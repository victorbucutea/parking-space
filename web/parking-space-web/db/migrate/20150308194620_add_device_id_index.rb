class AddDeviceIdIndex < ActiveRecord::Migration[5.1]
  def change
    add_index(:parking_spaces, :deviceid)
    add_index(:proposals, :deviceid)
  end
end
