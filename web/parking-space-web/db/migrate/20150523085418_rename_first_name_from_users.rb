class RenameFirstNameFromUsers < ActiveRecord::Migration
  def change
    rename_column :users, :first_name, :full_name
  end
end
