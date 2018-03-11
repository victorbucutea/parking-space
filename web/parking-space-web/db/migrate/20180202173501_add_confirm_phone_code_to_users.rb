class AddConfirmPhoneCodeToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :phone_confirm_code, :string
  end
end
