require 'test_helper'

class EmployeesControllerTest < ActionDispatch::IntegrationTest
  test "should get entitled" do
    get employees_entitled_url
    assert_response :success
  end

  test "should get one" do
    get employees_one_url
    assert_response :success
  end

end
