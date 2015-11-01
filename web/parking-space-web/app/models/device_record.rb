class DeviceRecord < ActiveRecord::Base
  self.abstract_class = true

  validate :deviceid_not_changed
  validates :deviceid, :presence => true


  private
  def deviceid_not_changed

    if self.deviceid_was.nil?
      return
    end

    if self.deviceid_changed?
      self.errors.add(:deviceid, 'not correct')
    end
  end
end
