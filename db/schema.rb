# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_10_26_112521) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.decimal "amount"
    t.string "currency"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_accounts_on_user_id"
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.string "cui"
    t.string "address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "registry"
    t.string "short_name"
  end

  create_table "locations", force: :cascade do |t|
    t.decimal "location_lat"
    t.decimal "location_long"
    t.string "parking_space_name"
    t.string "address"
    t.string "deviceid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.bigint "company_id"
    t.index ["company_id"], name: "index_locations_on_company_id"
  end

  create_table "messages", id: :serial, force: :cascade do |t|
    t.string "deviceid"
    t.string "content"
    t.integer "proposal_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "parameter_values", force: :cascade do |t|
    t.string "key"
    t.string "value"
    t.bigint "parameter_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "value1"
    t.string "value2"
    t.string "value3"
    t.string "value4"
    t.index ["key"], name: "index_parameter_values_on_key"
    t.index ["parameter_id"], name: "index_parameter_values_on_parameter_id"
  end

  create_table "parameters", force: :cascade do |t|
    t.string "name"
    t.string "default_value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "parking_perimeters", force: :cascade do |t|
    t.decimal "top_left_x"
    t.decimal "top_left_y"
    t.decimal "bottom_right_x"
    t.decimal "bottom_right_y"
    t.string "identifier"
    t.string "snapshot"
    t.bigint "parking_space_id"
    t.string "description"
    t.integer "perimeter_type"
    t.bigint "sensor_id"
    t.decimal "price"
    t.decimal "lat"
    t.decimal "lng"
    t.bigint "section_id"
    t.string "rules_expression"
    t.bigint "user_id"
    t.index ["parking_space_id"], name: "index_parking_perimeters_on_parking_space_id"
    t.index ["section_id"], name: "index_parking_perimeters_on_section_id"
    t.index ["sensor_id"], name: "index_parking_perimeters_on_sensor_id"
    t.index ["user_id"], name: "index_parking_perimeters_on_user_id"
  end

  create_table "parking_spaces", force: :cascade do |t|
    t.decimal "location_lat"
    t.decimal "location_long"
    t.decimal "recorded_from_lat"
    t.decimal "recorded_from_long"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "target_price"
    t.string "phone_number"
    t.string "owner_name"
    t.string "address_line_1"
    t.string "address_line_2"
    t.string "title"
    t.string "description"
    t.text "target_price_currency"
    t.datetime "space_availability_start"
    t.datetime "space_availability_stop"
    t.integer "legal_type"
    t.string "file1"
    t.string "file2"
    t.string "file3"
    t.string "weekly_schedule"
    t.time "daily_start"
    t.time "daily_stop"
    t.bigint "user_id"
    t.integer "source_type", default: 0
    t.index ["created_at"], name: "index_parking_spaces_on_created_at"
    t.index ["location_lat"], name: "index_parking_spaces_on_location_lat"
    t.index ["location_long"], name: "index_parking_spaces_on_location_long"
    t.index ["space_availability_start"], name: "index_parking_spaces_on_space_availability_start"
    t.index ["space_availability_stop"], name: "index_parking_spaces_on_space_availability_stop"
    t.index ["user_id"], name: "index_parking_spaces_on_user_id"
  end

  create_table "proposals", force: :cascade do |t|
    t.string "title_message"
    t.integer "parking_space_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "bid_amount"
    t.string "bid_currency"
    t.string "bidder_name"
    t.integer "approval_status"
    t.boolean "read"
    t.string "phone_number"
    t.string "message_from_device_id"
    t.datetime "start_date", null: false
    t.datetime "end_date", null: false
    t.integer "payment_status"
    t.datetime "payment_date"
    t.bigint "user_id"
    t.index ["bid_amount"], name: "index_proposals_on_bid_amount"
    t.index ["parking_space_id"], name: "index_proposals_on_parking_space_id"
    t.index ["user_id"], name: "index_proposals_on_user_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "identifier"
    t.bigint "user_id"
    t.bigint "company_id"
    t.bigint "location_id"
    t.index ["company_id"], name: "index_roles_on_company_id"
    t.index ["location_id"], name: "index_roles_on_location_id"
    t.index ["user_id"], name: "index_roles_on_user_id"
  end

  create_table "rules", force: :cascade do |t|
    t.text "description"
    t.string "name"
    t.decimal "start"
    t.decimal "stop"
    t.string "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "type"
  end

  create_table "sections", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "map_polygon"
    t.text "interior_map"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "location_id"
    t.index ["location_id"], name: "index_sections_on_location_id"
  end

  create_table "sensors", force: :cascade do |t|
    t.string "deviceid"
    t.string "title_message"
    t.string "snapshot"
    t.string "location_text"
    t.datetime "installation_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "lat"
    t.decimal "lng"
    t.string "module_info"
    t.boolean "active"
    t.boolean "hook_active"
    t.integer "hit_count"
    t.datetime "last_touch_date"
    t.integer "console_hit_count"
    t.bigint "section_id"
    t.index ["section_id"], name: "index_sensors_on_section_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "full_name"
    t.string "phone_number"
    t.string "device_id"
    t.string "country"
    t.string "notif_registration_id"
    t.string "license"
    t.boolean "phone_no_confirm"
    t.string "phone_confirm_code"
    t.string "payment_id"
    t.boolean "notif_approved"
    t.string "p256dh"
    t.string "notif_auth"
    t.index ["device_id"], name: "index_users_on_device_id", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["license"], name: "index_users_on_license"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "withdrawals", force: :cascade do |t|
    t.decimal "amount"
    t.string "iban"
    t.integer "status"
    t.string "status_message"
    t.datetime "processed_at"
    t.bigint "account_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_withdrawals_on_account_id"
    t.index ["amount"], name: "index_withdrawals_on_amount"
  end

  add_foreign_key "locations", "companies"
  add_foreign_key "parking_perimeters", "parking_spaces"
  add_foreign_key "parking_perimeters", "sections"
  add_foreign_key "parking_perimeters", "sensors"
  add_foreign_key "parking_perimeters", "users"
  add_foreign_key "parking_spaces", "users"
  add_foreign_key "proposals", "parking_spaces"
  add_foreign_key "proposals", "users"
  add_foreign_key "roles", "companies"
  add_foreign_key "roles", "locations"
  add_foreign_key "roles", "users"
  add_foreign_key "sections", "locations"
  add_foreign_key "sensors", "sections"
  add_foreign_key "withdrawals", "accounts"
end
