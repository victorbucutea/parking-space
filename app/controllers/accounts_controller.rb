# frozen_string_literal: true

class AccountsController < ApplicationController
  include PayApi

  before_action :authenticate_user!
  load_and_authorize_resource
  before_action :set_account, only: %i[index withdraw withdrawals]
  before_action :set_user_account, only: %i[list_account]
  before_action :set_withdrawal, only: %i[cancel_withdrawal reject_withdrawal execute_withdrawal]

  # GET /accounts.json
  def index
    @account = helpers.new_if_not_exists @account
    render :show
  end

  # GET /list_account.json
  def list_account
    @withdrawals = Withdrawal.where account_id: @account.id
  end

  def payments
    @payments = get_payments
  end

  def payment_details
    @payment_details = get_payment_details_for params[:payment_id]
  end

  # GET /accounts/withdrawals
  def withdrawals
    @withdrawals = Withdrawal.where account_id: @account.id
    render :show_withdrawals
  end

  # POST /accounts/cancel_withdrawal
  def cancel_withdrawal
    @withdrawal.rollback_amount
    @withdrawal.canceled!
    render :show_withdrawal
  end

  # POST /accounts/reject_withdrawal
  def reject_withdrawal
    @withdrawal.status_message = params[:comment]
    @withdrawal.rollback_amount
    unless @withdrawal.rejected!
      render json: { Error: @withdrawal.errors }, status: :unprocessable_entity
    end
    render :show_withdrawal
  end

  # POST /accounts/execute_withdrawal
  def execute_withdrawal
    @withdrawal.status_message = params[:comment]
    @withdrawal.executed!
    render :show_withdrawal
  end

  def withdraw
    unless @account.withdraw Withdrawal.new(account_params)
      render json: { Error: @account.errors }, status: :unprocessable_entity
      return
    end
    UserMailer.with(withdrawal: @account.withdrawals.last).withdrawal.deliver_later
    render :show
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_account
    @account = Account.find_by_user_id current_user.id
  end

  def set_user_account
    @account = Account.find_by_user_id params[:user_id]
    @account = helpers.new_if_not_exists @account

  end

  # Use callbacks to share common setup or constraints between actions.
  def set_withdrawal
    @withdrawal = Withdrawal.find params[:withdrawal_id]
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def account_params
    params.require(:account).permit(:amount, :iban)
  end
end
