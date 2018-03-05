class AddNotifRegistrationIdToUsers < ActiveRecord::Migration[5.1]
  def change
    change_column :users, :country, :string
    add_column :users, :notif_registration_id, :string
  end
end
