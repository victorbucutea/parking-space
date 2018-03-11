class RenameTypeToLegalTypeInParkingSpace < ActiveRecord::Migration[5.1]
  def change
    rename_column :parking_spaces, :type, :legal_type
  end
end
