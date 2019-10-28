class CreateJoinTableParkingPerimetersRules < ActiveRecord::Migration[5.2]
  def change
    create_join_table :parking_perimeters, :rules do |t|
      t.index [:parking_perimeter_id, :rule_id],name: 'parking_perim_rule_idx'
      t.index [:rule_id, :parking_perimeter_id],name: 'rule_parking_perim_idx'
    end
  end
end
