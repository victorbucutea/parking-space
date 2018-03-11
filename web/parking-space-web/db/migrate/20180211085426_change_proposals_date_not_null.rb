class ChangeProposalsDateNotNull < ActiveRecord::Migration[5.1]
  def change
    change_column :proposals, :start_date, :datetime, null: false
    change_column :proposals, :end_date, :datetime, null: false
  end
end
