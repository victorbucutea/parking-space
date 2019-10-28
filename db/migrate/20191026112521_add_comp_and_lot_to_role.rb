class AddCompAndLotToRole < ActiveRecord::Migration[5.2]
  def change

    add_reference :roles, :company, {index: true }
    add_foreign_key :roles, :companies

    add_reference :roles, :location, {index: true }
    add_foreign_key :roles, :locations
  end
end
