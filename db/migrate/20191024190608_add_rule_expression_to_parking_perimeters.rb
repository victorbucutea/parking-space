class AddRuleExpressionToParkingPerimeters < ActiveRecord::Migration[5.2]
  def change
    add_column :parking_perimeters, :rules_expression, :string
  end
end
