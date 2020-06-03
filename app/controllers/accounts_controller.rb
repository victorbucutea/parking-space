class AccountsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_account, only: %i[index withdraw withdrawals]
  before_action :set_withdrawal, only: %i[cancel_withdrawal reject_withdrawal execute_withdrawal]


  # GET /accounts/1
  # GET /accounts/1.json
  def index
    @account = helpers.new_if_not_exists @account
    render :show
  end

  # GET /accounts/1/withdrawals
  # GET /accounts/1.json
  def withdrawals
    @withdrawals = Withdrawal.where :account_id => @account.id
    render :show_withdrawals
  end

  # POST /accounts/1/cancel_withdrawal
  def cancel_withdrawal
    @withdrawal.canceled!
    render :show_withdrawal
  end

  # POST /accounts/1/reject_withdrawal
  def reject_withdrawal
    unless @withdrawal.rejected
      render json: {Error: @withdrawal.errors}, status: :unprocessable_entity
    end
    render :show_withdrawal
  end

  # POST /accounts/1/reject_withdrawal
  def execute_withdrawal
    @withdrawal.executed!
    render :show_withdrawal
  end

  def withdraw
    withdrawal = Withdrawal.new(account_params)

    @account.amount -= withdrawal.amount
    @account.iban = withdrawal.iban
    unless @account.save
      render json: { Error: @account.errors }, status: :unprocessable_entity
      return
    end

    @account.withdrawals << withdrawal
    unless withdrawal.valid?
      render json: { Error: withdrawal.errors }, status: :unprocessable_entity
      return
    end
    UserMailer.with(withdrawal: withdrawal).withdrawal.deliver_later

    render :show
  end


  private

  # Use callbacks to share common setup or constraints between actions.
  def set_account
    @account = Account.find_by_user_id current_user.id
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
