class ProposalArchive < ActiveRecord::Base

  enum approval_status: %i[pending rejected approved canceled]
  enum payment_status: %i[unpaid paid]

  def save_for(prop)
    self.proposal_id = prop.id
    self.id = nil
    self.comment = prop.comment
    self.comment = 'User update' if comment.nil?
    self.created_by = Current.user.email
    save
  end
end
