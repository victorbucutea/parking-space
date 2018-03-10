class AddReferenceLatitudeToDegreesToMeters < ActiveRecord::Migration[5.1]
  def change
    add_column :degree_to_meters, :reference_latitude, :integer
  end
end
