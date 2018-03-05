class AddIndexToFkProposals < ActiveRecord::Migration[5.1]
  def change
    add_index :proposals, :parking_space_id
  end
end
