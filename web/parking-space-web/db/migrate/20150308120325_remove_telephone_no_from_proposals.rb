class RemoveTelephoneNoFromProposals < ActiveRecord::Migration
  def change
    remove_column :proposals, :telephone_no
  end
end
