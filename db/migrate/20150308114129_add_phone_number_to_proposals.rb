class AddPhoneNumberToProposals < ActiveRecord::Migration
  def change
    add_column :proposals, :phone_number, :string
  end
end
