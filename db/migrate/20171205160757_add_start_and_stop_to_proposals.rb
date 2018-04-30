class AddStartAndStopToProposals < ActiveRecord::Migration[5.1]
  def change
    add_column :proposals, :start_date, :date
    add_column :proposals, :end_date, :date
  end
end
