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

ActiveRecord::Schema.define(version: 20160106201625) do

  create_table "messages", force: :cascade do |t|
    t.string   "deviceid",    limit: 255
    t.string   "content",     limit: 255
    t.integer  "proposal_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "parameter_values", force: :cascade do |t|
    t.string   "key",          limit: 255
    t.string   "value",        limit: 255
    t.integer  "parameter_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "value1",       limit: 255
    t.string   "value2",       limit: 255
    t.string   "value3",       limit: 255
    t.string   "value4",       limit: 255
  end

  add_index "parameter_values", ["parameter_id"], name: "index_parameter_values_on_parameter_id"

  create_table "parameters", force: :cascade do |t|
    t.string   "name",          limit: 255
    t.string   "default_value", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

# Could not dump table "parking_spaces" because of following NoMethodError
#   undefined method `[]' for nil:NilClass

# Could not dump table "proposals" because of following NoMethodError
#   undefined method `[]' for nil:NilClass

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                      default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "full_name",              limit: 255
    t.string   "phone_number",           limit: 255
    t.string   "device_id",              limit: 255
    t.string   "country",                limit: 255
    t.string   "notif_registration_id",  limit: 255
  end

  add_index "users", ["device_id"], name: "index_users_on_device_id", unique: true
  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
