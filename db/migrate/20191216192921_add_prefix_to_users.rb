class AddPrefixToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :prefix, :string
  end
end
