class SysParams
  include Singleton

  def initialize
    reinit
  end

  def get_default_value(name)
    @params_map[name]
  end

  def get_values(name)
    @params_map[name+'_values']
  end

  alias get get_default_value

  def get_i(name)
    if get(name)
      get(name).to_i
    else
      10
    end
  end

  def get_f(name)
    if get(name)
      get(name).to_f
    else
      0.1
    end
  end

  def all
    @params
  end

  def set_default_value!(name, value)
    @params_map[name] = value
  end

  def reinit
    @params = Parameter.all.includes(:parameter_values)
    @params_map = {}
    @params.each do |item|
      @params_map[item.name] = item.default_value
      values = {}
      item.parameter_values.each do |value|
        values[value.key] = value.value
      end
      @params_map[item.name + '_values'] = values
    end
  end

end


