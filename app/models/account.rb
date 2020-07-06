class Account < ActiveRecord::Base

  has_many :withdrawals
  belongs_to :user

  validate :amount_not_negative

  after_initialize :init

  def init
    self.amount ||= 0
  end

  def amount_pending(user)
    user_spaces = ParkingSpace.for_user(user).select([:id])
    active_reservations = Proposal.approved.paid.active_or_future.for_spaces user_spaces
    sum = 0
    active_reservations.each do |r|
      sum += r.payment_amount
    end
    sum
  end

  def withdraw(withdrawal, user)
    if withdrawal.amount > amount
      errors.add :general, 'Nu se poate retrage din cont suma solicitată'
      return false
    elsif amount - withdrawal.amount < amount_pending(user)
      errors.add :general, 'Nu se poate retrage din cont suma aferentă '+
                    'rezervărilor curente sau viitoare'
      return false
    end

    self.amount -= withdrawal.amount
    self.iban = withdrawal.iban
    save
  end

  def amount_not_negative
    if amount.negative?
      errors.add :general, 'Nu se poate opera pe cont suma solicitată'
    end
  end
end
