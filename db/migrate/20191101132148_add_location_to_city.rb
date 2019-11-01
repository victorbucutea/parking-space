class AddLocationToCity < ActiveRecord::Migration[5.2]
  def change

    add_reference :locations, :city, {index: true }
    add_foreign_key :locations, :cities
  end
end
