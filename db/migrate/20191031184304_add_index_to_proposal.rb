class AddIndexToProposal < ActiveRecord::Migration[5.2]
  def change
    add_index :proposals, :start_date
    add_index :proposals, :end_date
  end
end
