class AddTelephoneNoReadToProposal < ActiveRecord::Migration
  def change
    add_column :proposals, :telephone_no, :text
    add_column :proposals, :read, :boolean
  end
end
