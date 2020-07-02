class CreateParkingSpaceArchives < ActiveRecord::Migration[5.2]
  def change
    create_table :parking_space_archives do |t|
      t.decimal :location_lat
      t.decimal :location_long
      t.decimal :target_price
      t.string :phone_number
      t.string :owner_name
      t.string :address_line_1
      t.string :address_line_2
      t.string :title
      t.string :description
      t.text :target_price_currency
      t.datetime :space_availability_start
      t.datetime :space_availability_stop
      t.integer :legal_type
      t.string :weekly_schedule
      t.time :daily_start
      t.time :daily_stop
      t.bigint :user_id
      t.integer :source_type
      t.bigint :company_id
      t.integer :status
      t.decimal :review_avg
      t.integer :review_count
      t.text :comment
      t.timestamps
    end
  end
end
