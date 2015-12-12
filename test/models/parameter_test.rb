require 'test_helper'

class ParameterTest < ActiveSupport::TestCase

  test 'should get all parameters' do
    params = SysParams.instance.all

    params[1].name.must_be :==, 'starting_asking_price'
    params[1].default_value.must_be :==, '5'

    params[0].name.must_be :==, 'starting_currency'
    params[0].default_value.must_be :==, 'Eur'

    SysParams.instance.get_default_value('starting_currency').must_be :==, 'Eur'
    SysParams.instance.get_default_value('starting_asking_price').must_be :==, '5'
  end

  test 'should get multiple parameter values' do
    values = SysParams.instance.get_values('starting_currency')
    values['en'].must_be :==, 'Usd'
    values['es'].must_be :==, 'Eur'
    values['tr'].must_be :==, 'Try'

    values = SysParams.instance.get_values('starting_asking_price')
    values['kr'].must_be :==, '1000'
    values['es'].must_be :==, '3'

  end

  test 'should reinit parameters' do
    param = Parameter.new
    param.default_value = 1
    param.name ='some_param'
    param.save

    SysParams.instance.reinit
    SysParams.instance.get_default_value('some_param').must_be :==, '1'

    param2 = Parameter.find(1)
    param2.default_value = 'Ils'
    param2.save

    SysParams.instance.reinit
    SysParams.instance.get_default_value('starting_currency').must_be :==, 'Ils'

    param_value = ParameterValue.new
    param_value.key='jp'
    param_value.value='Yen'
    param2.parameter_values << param_value
    param2.save

    SysParams.instance.reinit
    currency_values = SysParams.instance.get_values('starting_currency')
    currency_values['en'].must_be :==, 'Usd'
    currency_values['es'].must_be :==, 'Eur'
    currency_values['tr'].must_be :==, 'Try'
    currency_values['jp'].must_be :==, 'Yen'


  end
end
