class AccountsController < ApplicationController
  before_action :set_account, only: [:index, :withdraw,:withdrawals]


  # GET /accounts/1
  # GET /accounts/1.json
  def index
    render :show
  end

  # GET /accounts/1/withdrawalas
  # GET /accounts/1.json
  def withdrawals
    @withdrawals = Withdrawal.where :account_id => @account.id
    render :show_withdrawals
  end

  def withdraw
    withdrawal = Withdrawal.new(account_params)
    @account.amount -= withdrawal.amount
    if @account.save
      @account.withdrawals << withdrawal
      render :show
    else
      render json: {Error: @account.errors}, status: :unprocessable_entity
    end
  end


  private
  # Use callbacks to share common setup or constraints between actions.
  def set_account
    @account = Account.find_by_user_id current_user.id
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def account_params
    params.require(:account).permit(:amount, :iban)
  end
end
