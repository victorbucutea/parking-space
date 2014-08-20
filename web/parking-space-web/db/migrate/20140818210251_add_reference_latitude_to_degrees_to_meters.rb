class AddReferenceLatitudeToDegreesToMeters < ActiveRecord::Migration
  def change
    add_column :degree_to_meters, :reference_latitude, :integer
  end
end
