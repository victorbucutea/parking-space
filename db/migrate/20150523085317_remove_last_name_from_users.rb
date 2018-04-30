class RemoveLastNameFromUsers < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :last_name

  end
end
