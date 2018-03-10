class RemoveWinFlagFromProposals < ActiveRecord::Migration[5.1]
  def change
    remove_column :proposals, :win_flag
  end
end
