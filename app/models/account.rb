class Account < ActiveRecord::Base


  has_many :withdrawals
  belongs_to :user

  validate :amount_is_sum_of_withdrawals
  validate :amount_is_not_negative

  after_initialize :init

  def init
    self.amount ||= 0
  end

  def amount_is_sum_of_withdrawals
    # sum of executed withdrawals should equal sum of payments - self.amount
  end

  def amount_is_not_negative
    unless amount >= 0
      errors.add :general, 'Nu se poate retrage din cont suma solicitata'
    end
  end
end
