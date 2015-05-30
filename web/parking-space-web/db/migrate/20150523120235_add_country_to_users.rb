class AddCountryToUsers < ActiveRecord::Migration
  def change
    add_column :users, :country, :text
  end
end
