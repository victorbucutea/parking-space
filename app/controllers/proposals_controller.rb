# frozen_string_literal: true

require 'pushmeup'

class ProposalsController < ApplicationController
  include SmsApi
  include PayApi
  include NotificationApi

  before_action :authenticate_user!
  load_and_authorize_resource
  before_action :set_proposal, only: %i[show pay reject cancel approve]

  def show; end

  # GET /parking_spaces/:p_sp_id/proposals.json
  def index
    @proposals = @proposals.includes(:user).where parking_space_id: params[:parking_space_id]
  end

  # GET /parking_spaces/:p_sp_id/proposals/schedule.json
  def schedule
    @proposals = Proposal.approved.includes(:user).where parking_space_id: params[:parking_space_id]
  end

  def next
    @proposals = @proposals.joins(:parking_space).active_or_future
                     .approved.order(:end_date).limit(1)
    if @proposals.empty?
      render json: { Error: 'No offer found.' }, status: :not_found
    else
      render :next
    end
  end

  def pay
    if @proposal.paid?
      render json: { Error: 'Nu se poate achita. Oferta a fost plătită deja.' }, status: :unprocessable_entity
      return
    end

    unless @proposal.pending?
      render json: { Error: 'Nu se poate achita. Oferta a fost respinsa.' }, status: :unprocessable_entity
      return
    end

    if submit_payment && @proposal.pay
      UserMailer.with(proposal: @proposal).new_offer.deliver_later
      UserMailer.with(proposal: @proposal).reservation_notif.deliver_later
      send_sms @proposal.parking_space.user.phone_number,
               current_user.full_name + ' a achitat contravaloarea de ' + @proposal.amount_with_vat.to_s +
               ' Ron pentru locul de parcare ' + @proposal.parking_space.address_line_1 + '. https://go-park.ro'
      render :show, status: :ok
    else
      render json: { Error: 'Eroare in procesarea platii. Va rugam incercati din nou.' }, status: :unprocessable_entity
    end
  end

  def reject
    # record history
    if @proposal.reject
      UserMailer.with(proposal: @proposal).offer_cancel.deliver_now
      render :show, status: :ok
    else
      render json: { Error: @proposal.errors }, status: :unprocessable_entity
    end
  end

  def cancel
    # record history
    if @proposal.cancel
      UserMailer.with(proposal: @proposal).offer_cancel.deliver_now
      render :show, status: :ok
    else
      render json: { Error: @proposal.errors }, status: :unprocessable_entity
    end
  end

  def approve
    if @proposal.approve
      format.json { render :show, status: :ok }
    else
      format.json { render json: { Error: @proposal.errors }, status: :unprocessable_entity }
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
      send_notification @proposal.parking_space.user,
                        'Ofertă pt locul tău din ' + @proposal.parking_space.address_line_1
      render :show, status: :created
    else
      render json: { Error: @proposal.errors }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /parking_spaces/:p_sp_id/proposals
  # PATCH/PUT /parking_spaces/:p_sp_id/proposals.json
  def update
    render json: { Error: { general: 'Offers cannot be updated' } }, status: :unprocessable_entity
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def proposal_params
    params.require(:proposal).permit(:phone_number, :title_message, :bid_amount,
                                     :bid_currency, :bidder_name, :start_date,
                                     :end_date, :approval_status, :parking_space_id,
                                     :created_at, :nonce, :payment_id)
  end

  def set_proposal
    @proposal = Proposal.find(params[:id])
  end
end
