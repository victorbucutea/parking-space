class AddTunnelNameToSensor < ActiveRecord::Migration[5.2]
  def change
    add_column :sensors, :tunnel_name, :string
  end
end
