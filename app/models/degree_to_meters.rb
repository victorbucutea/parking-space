class DegreeToMeters

  ONE_DEGREE_IN_M = {latitude_in_m: 111132, longitude_in_m: 78710, reference_latitude: 45}

  def self.from_meters_to_lat_deg(i)
    one_m_in_deg =  1.0 / ONE_DEGREE_IN_M[:latitude_in_m]
    return i * one_m_in_deg
  end

  def self.from_meters_to_long_deg(i)
    one_m_in_deg =  1.0 / ONE_DEGREE_IN_M[:longitude_in_m]
    return i * one_m_in_deg
  end
end