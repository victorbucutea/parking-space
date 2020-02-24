class AddFkDocumentsParkingSpaces < ActiveRecord::Migration[5.2]
  def change

    add_reference :documents, :parking_space, index: true, foreign_key: true
  end
end
