class AddFkAgainFromPSpaceToUsers < ActiveRecord::Migration[5.1]
  def change
    add_foreign_key :parking_spaces, :users, index: true
  end
end
