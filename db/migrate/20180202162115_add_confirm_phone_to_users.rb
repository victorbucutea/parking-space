class AddConfirmPhoneToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :phone_no_confirm, :boolean
  end
end
