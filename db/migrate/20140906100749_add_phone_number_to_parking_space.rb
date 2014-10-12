class AddPhoneNumberToParkingSpace < ActiveRecord::Migration
  def change
    add_column :parking_spaces, :phone_number, :string
  end
end
