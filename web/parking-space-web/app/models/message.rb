class Message < ActiveRecord::Base

  belongs_to :proposal

  validate :deviceid_not_changed

  validates :deviceid, :presence => true

  def deviceid_not_changed
    if proposal.deviceid == self.deviceid
      valid_prop_deviceid = true
    end

    if proposal.parking_space.deviceid == self.deviceid
      valid_prop_deviceid = true
    end

    unless valid_prop_deviceid
      errors.add :deviceid, 'invalid'
    end
  end
end
