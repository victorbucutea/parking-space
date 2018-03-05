class RemoveTelephoneNoFromProposals < ActiveRecord::Migration[5.1]
  def change
    remove_column :proposals, :telephone_no
  end
end
