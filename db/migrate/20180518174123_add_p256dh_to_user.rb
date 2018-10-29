class AddP256dhToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :p256dh, :string
    add_column :users, :notif_auth, :string
  end
end
