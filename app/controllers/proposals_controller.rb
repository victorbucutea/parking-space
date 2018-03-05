require 'pushmeup'


class ProposalsController < ApplicationController
  include SmsApi
  include PayApi

  before_action :authenticate_user!


  def show
    @proposal = Proposal.find(params[:id])
  end

  # GET /parking_spaces/:p_sp_id/proposals.json
  def index
    @proposals = Proposal.where parking_space_id: params[:parking_space_id]
  end

  def pay
    @proposal = Proposal.find(params[:proposal_id])
    owner_deviceid = current_user.device_id

    if @proposal.deviceid != owner_deviceid
      render json: {Error: 'Cannot pay an offer which doesn\'t belong to the current user'}, status: :unprocessable_entity
      return
    end

    unless @proposal.approved?
      render json: {Error: 'Nu se poate achita. Oferta a fost respinsa de proprietar sau a expirat.'}, status: :unprocessable_entity
      return
    end

    if @proposal.paid?
      render json: {Error: 'Nu se poate achita. Oferta a fost plătită deja.'}, status: :unprocessable_entity
      return
    end

    respond_to do |format|
      if submit_payment && @proposal.pay
        format.json {render :show, status: :ok}
      else
        format.json {render json: {Error: 'Eroare in procesarea platii. Va rugam incercati din nou.'}, status: :unprocessable_entity}
      end

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
    @proposal = Proposal.find(params[:proposal_id])
    owner_deviceid = current_user.device_id

    respond_to do |format|
      if @proposal.reject(owner_deviceid)
        notify_proposal_owner_reject @proposal
        format.json {render :show, status: :ok}
      else
        format.json {render json: {Error: @proposal.errors}, status: :unprocessable_entity}
      end
    end
  end

  def cancel
    @proposal = Proposal.find(params[:proposal_id])
    owner_deviceid = current_user.device_id

    respond_to do |format|
      if @proposal.cancel(owner_deviceid)
        notify_proposal_owner_reject @proposal
        format.json {render :show, status: :ok}
      else
        format.json {render json: {Error: @proposal.errors}, status: :unprocessable_entity}
      end
    end
  end

  def approve
    @proposal = Proposal.find(params[:proposal_id])
    owner_deviceid = current_user.device_id

    respond_to do |format|
      if @proposal.approve(owner_deviceid)
        notify_proposal_owner_approve @proposal

        format.json {render :show, status: :ok}
      else
        format.json {render json: {Error: @proposal.errors}, status: :unprocessable_entity}
      end
    end

  end

  # POST /parking_spaces/:p_sp_id/proposals
  # POST /parking_spaces/:p_sp_id/proposals.json
  def create
    @proposal = Proposal.new(proposal_params)

    @proposal.deviceid = current_user.device_id
    @proposal.bidder_name = current_user.full_name
    @proposal.phone_number = current_user.phone_number

    respond_to do |format|
      if @proposal.save
        notify_space_owner @proposal
        format.json {render :show, status: :created}
      else
        format.json {render json: {Error: @proposal.errors}, status: :unprocessable_entity}
      end
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
    params.require(:proposal).permit(:deviceid, :phone_number, :title_message, :bid_amount, :bid_currency, :bidder_name,
                                     :start_date, :end_date, :approval_status, :parking_space_id, :created_at, :nonce, :payment_id)
  end


  def notify_space_owner (proposal)
    owner_device_id = proposal.parking_space.deviceid
    space_owner = User.find_by_device_id owner_device_id

    data = {message: 'Ai o ofertă pentru locul tău!',
            area: :parking_space,
            parking_space: proposal.parking_space.id,
            msgcnt: 1}

    send_notification(space_owner, data)
  end

  def notify_proposal_owner_approve(proposal)
    owner_device_id = proposal.deviceid
    proposal_owner = User.find_by_device_id owner_device_id
    data = {message: 'Oferta pt. locul de parcare a fost acceptată!',
            area: :offer,
            offer: proposal.id,
            msgcnt: 1}

    send_notification(proposal_owner, data)
  end

  def notify_proposal_owner_reject(proposal)
    owner_device_id = proposal.deviceid
    proposal_owner = User.find_by_device_id owner_device_id
    data = {message: 'Oferta pt. locul de parcare a fost respinsă!',
            area: :offer,
            offer: proposal.id,
            msgcnt: 1}

    send_notification(proposal_owner, data)
  end


  def send_notification(destination_user, data)

    GCM.host = APP_CONFIG['android_gcm_url']
    GCM.format = :json
    GCM.key = Rails.application.secrets.google_api_key

    destination = [destination_user.notif_registration_id]

    GCM.send_notification(destination, data)
  rescue => e
    logger.error e.message
    logger.error e.backtrace.join("\n")

  end
end
