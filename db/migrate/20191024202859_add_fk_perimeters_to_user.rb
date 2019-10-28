class AddFkPerimetersToUser < ActiveRecord::Migration[5.2]
  def change

    add_reference :parking_perimeters, :user, {index: true , name: 'assignee_id'}
    add_foreign_key :parking_perimeters, :users
  end
end
