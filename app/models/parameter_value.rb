class ParameterValue < ActiveRecord::Base
  scope :for_country, ->(ctry) { where 'key = ?', ctry }
  belongs_to :parameter
end
