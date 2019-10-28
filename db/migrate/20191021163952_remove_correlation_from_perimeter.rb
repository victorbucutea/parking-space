class RemoveCorrelationFromPerimeter < ActiveRecord::Migration[5.2]
  def change
    remove_column :parking_perimeters, :correlation_threshold
  end
end
