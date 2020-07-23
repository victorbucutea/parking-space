# frozen_string_literal: true

class Account < ActiveRecord::Base
  has_many :withdrawals
  belongs_to :user

  validate :amount_not_negative

  after_initialize :init

  def init
    self.amount ||= 0
  end

  def amount_pending
    user_spaces = ParkingSpace.for_user(Current.user).select([:id])
    active_reservations = Proposal.approved.paid.active_or_future.for_spaces user_spaces
    sum = 0
    active_reservations.each do |r|
      sum += r.payment_amount
    end
    sum
  end

  def withdraw(withdrawal)
    withdrawals << withdrawal
    if !withdrawal.valid?
      withdrawal.errors.messages[:general].each do |msg|
        errors.add :general, msg
      end
      false
    else
      self.amount -= withdrawal.amount
      save
    end
  end

  def withdraw!(withdrawal)
    withdrawal.allow_negative = true
    withdraw withdrawal
    withdrawal.executed!
  end

  def amount_not_negative
    errors.add :general, 'Nu se poate opera suma solicitată' if amount.negative?
  end
end
