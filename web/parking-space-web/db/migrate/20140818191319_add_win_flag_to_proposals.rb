class AddWinFlagToProposals < ActiveRecord::Migration
  def change
    add_column :proposals, :win_flag, :boolean
  end
end
