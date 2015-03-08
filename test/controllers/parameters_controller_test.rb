require 'test_helper'

class ParametersControllerTest < ActionController::TestCase
  # setup do
  #   @parameter = parameters(:one)
  # end

  setup do
    @request.headers['Content-Type'] = 'application/json'
    @request.headers['Accept'] = 'application/json'
  end


  test 'should get all props' do
    get :index
    parameters = assigns(:parameters)

    assert 2 ,parameters.size
    assert 3 ,parameters.parameter_values.size

  end

  test 'should get all props and specific value for key' do
    get :index ,{key: 'tr'}

    parameters = assigns(:parameters)

    assert 2 ,parameters.size
    assert 3 ,parameters.parameter_values.size

  end


  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:parameters)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create parameter" do
    assert_difference('Parameter.count') do
      post :create, parameter: { name: @parameter.name,
                                 default_value: @parameter.default_value }
    end

    assert_redirected_to parameter_path(assigns(:parameter))
  end

  test "should show parameter" do
    get :show, id: @parameter
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @parameter
    assert_response :success
  end

  test "should update parameter" do
    patch :update, id: @parameter, parameter: { name: @parameter.name, default_value: @parameter.default_value }
    assert_redirected_to parameter_path(assigns(:parameter))
  end

  test "should destroy parameter" do
    assert_difference('Parameter.count', -1) do
      delete :destroy, id: @parameter
    end

    assert_redirected_to parameters_path
  end
end
