# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Message.delete_all
Proposal.delete_all
ParkingSpace.delete_all

ParkingSpace.create!([
                         {id: 1, location_lat: 44.415148645664974, location_long: 26.0932105042677, recorded_from_lat: 44.415048645664974, recorded_from_long: 26.04766027634218, deviceid: 'IMEI8129231231'},
                         {id: 2, location_lat: 44.415248645664974, location_long: 26.0942105142677, recorded_from_lat: 44.415048645664974, recorded_from_long: 26.04762027634218, deviceid: 'IMEI8129331241'},
                         {id: 3, location_lat: 44.415342345664974, location_long: 26.0952105242677, recorded_from_lat: 44.415048645464974, recorded_from_long: 26.04764027634218, deviceid: 'IMEI8129431251'},
                         {id: 4, location_lat: 44.415444445664974, location_long: 26.0962105032677, recorded_from_lat: 44.415048643664974, recorded_from_long: 26.04766027634218, deviceid: 'IMEI8129531261'},
                         {id: 5, location_lat: 44.415548125664974, location_long: 26.0972105042677, recorded_from_lat: 44.415048644664974, recorded_from_long: 26.04767027634218, deviceid: 'IMEI8129631271'},
                     ])


Proposal.create! ([
    {id: 1, deviceid: "IMEI8129631232", title_message: "Hello, I'd like to buy #1", bid_amount: 10, bid_currency: 'EUR', win_flag: false, parking_space_id: 1},
    {id: 2, deviceid: "IMEI8129631233", title_message: "Hello, I'd also like to #1", bid_amount: 20, bid_currency: 'EUR', win_flag: false, parking_space_id: 1},
    {id: 3, deviceid: "IMEI8129631234", title_message: "Hello, I'd like to buy spot #2", bid_amount: 10, bid_currency: 'EUR', win_flag: false, parking_space_id: 2},
    {id: 4, deviceid: "IMEI8129631235", title_message: "Hello, I'd like to buy spot #2", bid_amount: 20, bid_currency: 'RON', win_flag: false, parking_space_id: 2},
    {id: 5, deviceid: "IMEI8129631236", title_message: "Hello, I'd like to buy spot #3", bid_amount: 20, bid_currency: 'RON', win_flag: false, parking_space_id: 3},
    {id: 6, deviceid: "IMEI8129631237", title_message: "Hello, I'd like to buy spot #3", bid_amount: 20, bid_currency: 'RON', win_flag: false, parking_space_id: 3},
])


Message.create! ([
    {id: 1, deviceid: "IMEI8129631231", content: "I'm not happy with the offer you gave me", proposal_id: 1},
    {id: 2, deviceid: "IMEI8129631232", content: "I will give you +10 EUR", proposal_id: 1},
    {id: 3, deviceid: "IMEI8129631241", content: "I'm not happy with the offer you gave me", proposal_id: 2},
    {id: 4, deviceid: "IMEI8129631234", content: "I will give you +10 EUR", proposal_id: 2}
])