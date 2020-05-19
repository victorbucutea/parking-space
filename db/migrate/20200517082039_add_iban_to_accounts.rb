class AddIbanToAccounts < ActiveRecord::Migration[5.2]
  def change
    add_column :accounts, :iban, :string
  end
end
