class AddFkFromPSpaceToUsers < ActiveRecord::Migration[5.1]
  def change
    add_reference :parking_spaces,:user, foreign_key: true
  end
end
