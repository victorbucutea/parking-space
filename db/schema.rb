# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20160117134100) do

  create_table "messages", force: :cascade do |t|
    t.string   "deviceid"
    t.string   "content"
    t.integer  "proposal_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "parameter_values", force: :cascade do |t|
    t.string   "key"
    t.string   "value"
    t.integer  "parameter_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "value1"
    t.string   "value2"
    t.string   "value3"
    t.string   "value4"
  end

  add_index "parameter_values", ["key"], name: "index_parameter_values_on_key"
  add_index "parameter_values", ["parameter_id"], name: "index_parameter_values_on_parameter_id"

  create_table "parameters", force: :cascade do |t|
    t.string   "name"
    t.string   "default_value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "parking_spaces", force: :cascade do |t|
    t.decimal  "location_lat"
    t.decimal  "location_long"
    t.decimal  "recorded_from_lat"
    t.decimal  "recorded_from_long"
    t.string   "deviceid"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal  "target_price"
    t.decimal  "approved_proposal_id"
    t.string   "phone_number"
    t.string   "owner_name"
    t.integer  "interval"
    t.string   "address_line_1"
    t.string   "address_line_2"
    t.string   "title"
    t.string   "description"
    t.text     "target_price_currency"
    t.text     "image_file_name"
    t.text     "image_content_type"
    t.integer  "image_file_size"
    t.text     "thumbnail_image_url"
    t.text     "standard_image_url"
    t.decimal  "rotation_angle"
    t.date     "availability_start"
    t.date     "availability_stop"
    t.datetime "space_availability_start"
    t.datetime "space_availability_stop"
  end

  add_index "parking_spaces", ["created_at"], name: "index_parking_spaces_on_created_at"
  add_index "parking_spaces", ["deviceid"], name: "index_parking_spaces_on_deviceid"
  add_index "parking_spaces", ["interval"], name: "index_parking_spaces_on_interval"
  add_index "parking_spaces", ["location_lat"], name: "index_parking_spaces_on_location_lat"
  add_index "parking_spaces", ["location_long"], name: "index_parking_spaces_on_location_long"
  add_index "parking_spaces", ["space_availability_start"], name: "index_parking_spaces_on_space_availability_start"
  add_index "parking_spaces", ["space_availability_stop"], name: "index_parking_spaces_on_space_availability_stop"

  create_table "proposals", force: :cascade do |t|
    t.string   "deviceid"
    t.string   "title_message"
    t.integer  "parking_space_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal  "bid_amount"
    t.string   "bid_currency"
    t.string   "bidder_name"
    t.integer  "approval_status"
    t.boolean  "read"
    t.string   "phone_number"
    t.string   "message_from_device_id"
  end

  add_index "proposals", ["bid_amount"], name: "index_proposals_on_bid_amount"
  add_index "proposals", ["deviceid"], name: "index_proposals_on_deviceid"

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "full_name"
    t.string   "phone_number"
    t.string   "device_id"
    t.string   "country"
    t.string   "notif_registration_id"
  end

  add_index "users", ["device_id"], name: "index_users_on_device_id", unique: true
  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
