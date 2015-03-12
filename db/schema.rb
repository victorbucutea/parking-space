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

ActiveRecord::Schema.define(version: 20150310180615) do

  create_table "messages", force: true do |t|
    t.string   "deviceid"
    t.string   "content"
    t.integer  "proposal_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "parameter_values", force: true do |t|
    t.string   "key"
    t.string   "value"
    t.integer  "parameter_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "parameter_values", ["parameter_id"], name: "index_parameter_values_on_parameter_id"

  create_table "parameters", force: true do |t|
    t.string   "name"
    t.string   "default_value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

# Could not dump table "parking_spaces" because of following NoMethodError
#   undefined method `[]' for nil:NilClass

  create_table "proposals", force: true do |t|
    t.string   "deviceid"
    t.string   "title_message"
    t.integer  "parking_space_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "bid_amount"
    t.string   "bid_currency"
    t.string   "bidder_name"
    t.integer  "approval_status"
    t.boolean  "read"
    t.string   "phone_number"
    t.string   "message_from_device_id"
  end

  add_index "proposals", ["deviceid"], name: "index_proposals_on_deviceid"

end
