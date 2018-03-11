class AddLicenseToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :license, :string
    add_index :users, :license
  end
end
