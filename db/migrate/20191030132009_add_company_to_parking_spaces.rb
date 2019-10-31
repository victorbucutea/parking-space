class AddCompanyToParkingSpaces < ActiveRecord::Migration[5.2]
  def change

    add_reference :parking_spaces, :company, {index: true }
    add_foreign_key :parking_spaces, :companies

  end
end
