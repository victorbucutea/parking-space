class ChangeStartAndStopToProposals < ActiveRecord::Migration[5.1]
  def change
    change_column :proposals, :start_date, :datetime
    change_column :proposals, :end_date, :datetime
  end
end
