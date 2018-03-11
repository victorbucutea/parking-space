class Withdrawal < ActiveRecord::Base

  enum status: [:pending, :rejected, :executed, :canceled]
  belongs_to :account
  after_initialize :init



  def init
    self.status ||= :pending
  end

end
