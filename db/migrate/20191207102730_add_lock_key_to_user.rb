class AddLockKeyToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :unlock_token, :string # Only if unlock strategy is :email or :both
    add_index :users, :unlock_token, unique: true
  end
end
