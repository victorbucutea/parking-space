class AddMessagedFromDeviceIdToProposals < ActiveRecord::Migration[5.1]
  def change
    add_column :proposals, :message_from_device_id, :string
  end
end
