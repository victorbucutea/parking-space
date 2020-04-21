require 'pushmeup'


class ProposalsController < ApplicationController
  include SmsApi
  include PayApi
  include NotificationApi

  before_action :authenticate_user!
  before_action :set_proposal, only: %i[pay reject cancel approve]


  def show
    @proposal = Proposal.find(params[:id])
  end

  # GET /parking_spaces/:p_sp_id/proposals.json
  def index
    @proposals = Proposal.where parking_space_id: params[:parking_space_id]
  end

  def pay
    if @proposal.user != current_user
      render json: {Error: 'Cannot pay an offer which doesn\'t belong to the current user'}, status: :unprocessable_entity
      return
    end

    unless @proposal.pending?
      render json: {Error: 'Nu se poate achita. Oferta a fost respinsa de proprietar sau a expirat.'}, status: :unprocessable_entity
      return
    end

    if @proposal.paid?
      render json: {Error: 'Nu se poate achita. Oferta a fost plătită deja.'}, status: :unprocessable_entity
      return
    end

    if submit_payment && @proposal.pay
      send_sms @proposal.parking_space.user.phone_number,
               current_user.full_name + ' a achitat contravaloarea de ' + @proposal.amount_with_vat.to_s +
                   ' Ron pentru locul de parcare ' + @proposal.parking_space.address_line_1 + '. https://go-park.ro'
      render :show, status: :ok
    else
      render json: {Error: 'Eroare in procesarea platii. Va rugam incercati din nou.'}, status: :unprocessable_entity
    end

  end

  def get_user_payments
    @payments = get_payments
    render :payments
  end

  def get_payment_details
    @payment_details = get_payment_details_for params[:payment_id]
    render :payment_details
  end

  def reject

    respond_to do |format|
      if @proposal.reject
        format.json { render :show, status: :ok }
      else
        format.json { render json: {Error: @proposal.errors}, status: :unprocessable_entity }
      end
    end
  end

  def cancel

    respond_to do |format|
      if @proposal.cancel
        format.json { render :show, status: :ok }
      else
        format.json { render json: {Error: @proposal.errors}, status: :unprocessable_entity }
      end
    end
  end

  def approve

    respond_to do |format|
      if @proposal.approve
        format.json { render :show, status: :ok }
      else
        format.json { render json: {Error: @proposal.errors}, status: :unprocessable_entity }
      end
    end

  end

  # POST /parking_spaces/:p_sp_id/proposals
  # POST /parking_spaces/:p_sp_id/proposals.json
  def create
    @proposal = Proposal.new(proposal_params)

    @proposal.bidder_name = current_user.full_name
    @proposal.phone_number = current_user.phone_number
    @proposal.user = current_user

    if @proposal.save
      send_notification @proposal.parking_space.user, 'Ofertă pt locul tău din ' + @proposal.parking_space.address_line_1
      render :show, status: :created
    else
      render json: {Error: @proposal.errors}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /parking_spaces/:p_sp_id/proposals
  # PATCH/PUT /parking_spaces/:p_sp_id/proposals.json
  def update
    render json: {Error: {general: 'Offers cannot be updated'}}, status: :unprocessable_entity
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def proposal_params
    params.require(:proposal).permit(:phone_number, :title_message, :bid_amount, :bid_currency, :bidder_name,
                                     :start_date, :end_date, :approval_status, :parking_space_id, :created_at, :nonce, :payment_id)
  end

  def set_proposal
    @proposal = Proposal.find(params[:proposal_id])
  end

end
