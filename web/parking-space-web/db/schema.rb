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

ActiveRecord::Schema.define(version: 20150208192113) do

  create_table "messages", force: true do |t|
    t.string   "deviceid"
    t.string   "content"
    t.integer  "proposal_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "parking_space_images", force: true do |t|
    t.text     "name"
    t.integer  "parking_space_id"
    t.binary   "content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.binary   "thumbnail"
  end

  add_index "parking_space_images", ["parking_space_id"], name: "index_parking_space_images_on_parking_space_id"

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
    t.string   "status"
    t.string   "bidder_name"
    t.integer  "approval_status"
    t.text     "telephone_no"
    t.boolean  "read"
  end

end
