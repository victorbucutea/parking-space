require 'test_helper'

class ParametersControllerTestJson < ActionController::TestCase
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

end
