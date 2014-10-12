require 'test_helper'

class ParkingSpacesControllerTest < ActionController::TestCase


  test "should get all parking spaces for lat&long&range" do

    xhr :get, :index, {lat: "44.41514", lon: "26.09321", range: "1"}
    parking_spaces = assigns(:parking_spaces)
    assert_equal 1, parking_spaces.size
    assert_equal 'IMEI8129231231', parking_spaces[0].deviceid

  end

  test "should get all parking spaces for 50 m range" do

    xhr :get, :index, {lat: "44.41514", lon: "26.09321", range: "50"}
    parking_spaces = assigns(:parking_spaces)
    assert_equal 1, parking_spaces.size
    assert_equal 'IMEI8129231231', parking_spaces[0].deviceid

    #index should not return deviceid, that is secret
    p_space = JSON.parse(@response.body)
    assert_nil p_space[0]['deviceid']

  end

  test "should get all parking spaces for 100 m range" do

    xhr :get, :index, {lat: "44.41514", lon: "26.09321", range: "100"}
    parking_spaces = assigns(:parking_spaces)
    assert_equal 2, parking_spaces.size
    assert_equal 'IMEI8129231231', parking_spaces[0].deviceid
    assert_equal 'IMEI8129331241', parking_spaces[1].deviceid

  end

  test "should get all parking spaces for 160 m range" do

    xhr :get, :index, {lat: "44.41514", lon: "26.09321", range: "160"}
    parking_spaces = assigns(:parking_spaces)
    assert_equal 3, parking_spaces.size
    assert_equal 'IMEI8129231231', parking_spaces[0].deviceid
    assert_equal 'IMEI8129331241', parking_spaces[1].deviceid
    assert_equal 'IMEI8129431251', parking_spaces[2].deviceid

  end

  test "should get all parking spaces for 1000 m range" do

    xhr :get, :index, {lat: "44.41514", lon: "26.09321", range: "1000"}
    parking_spaces = assigns(:parking_spaces)
    assert_equal 3, parking_spaces.size
    assert_equal 'IMEI8129231231', parking_spaces[0].deviceid
    assert_equal 'IMEI8129331241', parking_spaces[1].deviceid
    assert_equal 'IMEI8129431251', parking_spaces[2].deviceid

  end

  test "should get all parking spaces for 1200 m range" do

    xhr :get, :index, {lat: "44.41514", lon: "26.09321", range: "1200"}
    parking_spaces = assigns(:parking_spaces)
    assert_equal 5, parking_spaces.size
    assert_equal 'IMEI8129231231', parking_spaces[0].deviceid
    assert_equal 'IMEI8129331241', parking_spaces[1].deviceid
    assert_equal 'IMEI8129431251', parking_spaces[2].deviceid
    assert_equal 'IMEI8129531261', parking_spaces[3].deviceid
    assert_equal 'IMEI8129631271', parking_spaces[4].deviceid
  end

  test 'should return error if no lat|long|range' do
    xhr :get, :index, {lat: "", lon: "", range: ""}
    assert_response :unprocessable_entity

    xhr :get, :index, {lat: "44.41514", lon: "26.09321", range: ""}
    assert_response :unprocessable_entity

    xhr :get, :index, {lat: "", lon: "", range: "1000"}
    assert_response :unprocessable_entity

    xhr :get, :index, {lat: "44.41514", range: "1000"}
    assert_response :unprocessable_entity

    xhr :get, :index, {lat: "44.41514", lon: "26.09321"}
    assert_response :unprocessable_entity
  end

  test 'should return errro if range > 1200m' do
    xhr :get, :index, {lat: "44.41514", lon: "26.09321", range: "1201"}
    assert_response :unprocessable_entity
  end

  test 'should return 1 space if range > 1200m and long term' do
    xhr :get, :index, { lat: "44.41514", lon: "26.09321", range: "1201", term: "long_term" }

    p_space = JSON.parse(@response.body)

    # deviceid is secret
    assert_nil p_space[0]['deviceid']
    assert_equal 6, p_space[0]['id']
    assert_equal '26.10721', p_space[0]['location_long']
    assert_equal '44.425654', p_space[0]['location_lat']
    assert_equal 'Victor', p_space[0]['owner_name']
    assert_equal '0727456250', p_space[0]['phone_number']
    assert_equal 'long_term', p_space[0]['interval']
  end

  test "should create short term parking_space" do
    assert_difference('ParkingSpace.count',1) do
      xhr :post, :create, :parking_space => {
          location_lat: 44.42534, #~22 m East from id 1
          location_long: 26.11521, # ~156m North from id 1
          recorded_from_lat: 44.42504,
          recorded_from_long: 26.05764,
          owner_name: 'Victor',
          phone_number: '0727456250',
          deviceid: 'IMEI8139431251'}
    end

    p_space = JSON.parse(@response.body)
    # deviceid is secret
    assert_nil p_space['deviceid']
    assert_equal '26.11521', p_space['location_long']
    assert_equal '44.42534', p_space['location_lat']
    assert_equal 'Victor', p_space['owner_name']
    assert_equal '0727456250', p_space['phone_number']
    assert_equal 'short_term', p_space['interval']
  end


  test "should create long term parking_space" do
    assert_difference('ParkingSpace.count',1) do
      xhr :post, :create, :parking_space => {
          location_lat: 44.42534, #~22 m East from id 1
          location_long: 26.11521, # ~156m North from id 1
          recorded_from_lat: 44.42504,
          recorded_from_long: 26.05764,
          owner_name: 'Victor',
          phone_number: '0727456250',
          interval: 'long_term',
          deviceid: 'IMEI8139431251'}
    end

    p_space = JSON.parse(@response.body)
    # deviceid is secret
    assert_nil p_space['deviceid']
    assert_equal '26.11521', p_space['location_long']
    assert_equal '44.42534', p_space['location_lat']
    assert_equal 'Victor', p_space['owner_name']
    assert_equal '0727456250', p_space['phone_number']
    assert_equal 'long_term', p_space['interval']
  end

  test 'should not create parking space if lat or long invalid' do
    # lat or long > 180
  end

  test 'should not create if request incomplete ' do
    # lat or long missing
    assert_difference('ParkingSpace.count',0) do
      xhr :post, :create, :parking_space => {
          recorded_from_lat: 44.42504,
          recorded_from_long: 26.05764,
          deviceid: 'IMEI8139431251'}
    end

    assert_difference('ParkingSpace.count',0) do
      xhr :post, :create, :parking_space => {
          location_lat: 44.42534, #~22 m East from id 1
          location_long: 26.11521, # ~156m North from id 1
          recorded_from_lat: 44.42504,
          deviceid: 'IMEI8139431251'}
    end

    assert_difference('ParkingSpace.count',0) do
      xhr :post, :create, :parking_space => {
          location_lat: 44.42534, #~22 m East from id 1
          location_long: 26.11521, # ~156m North from id 1
          recorded_from_lat: 44.42504,
          recorded_from_long: 26.05764}
    end


  end

  test 'should not create parking space if lat or long not on this planet' do
    # lat or long > 180
    assert_difference('ParkingSpace.count',0) do
      xhr :post, :create, :parking_space => {
          location_lat: 94.42534,
          location_long: 26.11521,
          recorded_from_lat: 44.42504,
          recorded_from_long: 26.05764,
          deviceid: 'IMEI8139431251'}

      assert_equal 1, assigns(:parking_space).errors.size
    end

    assert_difference('ParkingSpace.count',0) do
      xhr :post, :create, :parking_space => {
          location_lat: -89.42534,
          location_long: -181.11521,
          recorded_from_lat: 44.42504,
          recorded_from_long: 26.05764,
          deviceid: 'IMEI8139431251'}

      assert_equal 1, assigns(:parking_space).errors.size
    end

    assert_difference('ParkingSpace.count',0) do
      xhr :post, :create, :parking_space => {
          location_lat: -89.42534,
          location_long: 181.11521,
          recorded_from_lat: 44.42504,
          recorded_from_long: 26.05764,
          deviceid: 'IMEI8139431251'}

      assert_equal 1, assigns(:parking_space).errors.size
    end

    assert_difference('ParkingSpace.count',0) do
      xhr :post, :create, :parking_space => {
          location_lat: -89.42534,
          location_long: -181.11521,
          recorded_from_lat: 44.42504,
          recorded_from_long: 26.05764,
          deviceid: 'IMEI8139431251'}

      assert_equal 1, assigns(:parking_space).errors.size
    end
  end

  test "should show parking_space" do
    xhr :get, :show, id: 1
    assert_response :success

    p_space = JSON.parse(@response.body)

    assert_nil p_space['deviceid']
    assert_equal '26.09321', p_space['location_long']
    assert_equal '44.41514', p_space['location_lat']
  end

  test "should update parking space with valid deviceid" do
    xhr :put, :update, id: 1, :parking_space => {
        id: 1,
        location_lat: 44.42534, #~22 m East from id 1
        location_long: 26.11521, # ~156m North from id 1
        recorded_from_lat: 44.42504,
        recorded_from_long: 26.05764,
        deviceid: 'IMEI8129231231'}

    p_space = JSON.parse(@response.body)

    assert_nil p_space['deviceid']
    assert_equal '26.11521', p_space['location_long']
    assert_equal '44.42534', p_space['location_lat']

  end

  test "should not update parking space if device id invalid" do
    xhr :put, :update, id: 1, :parking_space => {
        id: 1,
        location_lat: 44.42534, #~22 m East from id 1
        location_long: 26.11521, # ~156m North from id 1
        recorded_from_lat: 44.42504,
        recorded_from_long: 26.05764,
        deviceid: 'IMEI8129231233'}

    p_space = JSON.parse(@response.body)

    assert_response :unprocessable_entity
  end

  test "should not update parking space if device id empty" do
    xhr :put, :update, id: 1, :parking_space => {
        id: 1,
        location_lat: 44.42534, #~22 m East from id 1
        location_long: 26.11521, # ~156m North from id 1
        recorded_from_lat: 44.42504,
        recorded_from_long: 26.05764,
        deviceid: ''}

    p_space = JSON.parse(@response.body)

    assert_response :unprocessable_entity
  end

  test "should not update parking space if device id not present" do
    xhr :put, :update, id: 1, :parking_space => {
        id: 1,
        location_lat: 44.42534, #~22 m East from id 1
        location_long: 26.11521, # ~156m North from id 1
        recorded_from_lat: 44.42504,
        recorded_from_long: 26.05764}

    p_space = JSON.parse(@response.body)

    assert_response :unprocessable_entity
  end


  test "should destroy parking_space" do
    assert_difference('ParkingSpace.count', -1) do
      xhr :delete, :destroy, id: 1, :parking_space => {deviceid: 'IMEI8129231231'}
    end
    assert_response :success
  end


  test "should not destroy parking_space if no device id present" do
    assert_difference('ParkingSpace.count', 0) do
      xhr :delete, :destroy, id: 1
    end
    assert_response :unprocessable_entity
  end

  test "should not destroy parking_space if invalid device id" do
    assert_difference('ParkingSpace.count', 0) do
      xhr :delete, :destroy, id: 1, :parking_space => {deviceid: 'IMEX8129231231'}
    end
    assert_response :unprocessable_entity
  end

  test "should not destroy parking_space if empty device id" do
    assert_difference('ParkingSpace.count', 0) do
      xhr :delete, :destroy, id: 1, :parking_space => {deviceid: ''}
    end
    assert_response :unprocessable_entity
  end

end
