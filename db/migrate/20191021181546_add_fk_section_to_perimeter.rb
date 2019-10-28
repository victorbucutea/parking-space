class AddFkSectionToPerimeter < ActiveRecord::Migration[5.2]
  def change

    add_reference :parking_perimeters, :section, {index: true }
    add_foreign_key :parking_perimeters, :sections
  end
end
