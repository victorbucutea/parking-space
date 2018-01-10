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

ActiveRecord::Schema.define(version: 20171223212009) do

  create_table "messages", force: :cascade do |t|
    t.string "deviceid"
    t.string "content"
    t.integer "proposal_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "parameter_values", force: :cascade do |t|
    t.string "key"
    t.string "value"
    t.integer "parameter_id"
    t.datetime "created_at"
    t.datetime "updated_at"
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
    t.datetime "created_at"
    t.datetime "updated_at"
  end

# Could not dump table "parking_spaces" because of following StandardError
#   Unknown type '' for column 'approved_proposal_id'

# Could not dump table "proposals" because of following StandardError
#   Unknown type '' for column 'bid_amount'

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
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "full_name"
    t.string "phone_number"
    t.string "device_id"
    t.string "country"
    t.string "notif_registration_id"
    t.string "license"
    t.index ["device_id"], name: "index_users_on_device_id", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["license"], name: "index_users_on_license"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
