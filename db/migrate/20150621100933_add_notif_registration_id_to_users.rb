class AddNotifRegistrationIdToUsers < ActiveRecord::Migration
  def change
    change_column :users, :country, :string
    add_column :users, :notif_registration_id, :string
  end
end
