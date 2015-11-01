class AddDeviceIdAndPhoneNumberToUsers < ActiveRecord::Migration
  def change
    add_column :users, :phone_number, :string
    add_column :users, :device_id , :string
  end
end
