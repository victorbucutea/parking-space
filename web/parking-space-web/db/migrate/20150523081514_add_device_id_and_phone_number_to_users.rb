class AddDeviceIdAndPhoneNumberToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :phone_number, :string
    add_column :users, :device_id , :string
  end
end
