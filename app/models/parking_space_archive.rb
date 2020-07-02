class ParkingSpaceArchive < ActiveRecord::Base
  enum legal_type: %i[public_parking private_parking]
  enum source_type: %i[user_source sensor_source company_source]
  enum status: %i[missing_title_deed validation_pending validated]

  def save_for(space)
    self.space_id = space.id
    self.id = nil
    self.comment = space.comment
    self.comment = 'User update' if comment.nil?
    self.created_by = Current.user.email
    save
  end

end
