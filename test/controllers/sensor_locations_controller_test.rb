require 'test_helper'

class SensorLocationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @sensor_location = sensor_locations(:one)
  end

  test "should get index" do
    get sensor_locations_url
    assert_response :success
  end

  test "should get new" do
    get new_sensor_location_url
    assert_response :success
  end

  test "should create sensor_location" do
    assert_difference('SensorLocation.count') do
      post sensor_locations_url, params: { sensor_location: {  } }
    end

    assert_redirected_to sensor_location_url(SensorLocation.last)
  end

  test "should show sensor_location" do
    get sensor_location_url(@sensor_location)
    assert_response :success
  end

  test "should get edit" do
    get edit_sensor_location_url(@sensor_location)
    assert_response :success
  end

  test "should update sensor_location" do
    patch sensor_location_url(@sensor_location), params: { sensor_location: {  } }
    assert_redirected_to sensor_location_url(@sensor_location)
  end

  test "should destroy sensor_location" do
    assert_difference('SensorLocation.count', -1) do
      delete sensor_location_url(@sensor_location)
    end

    assert_redirected_to sensor_locations_url
  end
end
