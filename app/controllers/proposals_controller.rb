require 'pushmeup'


class ProposalsController < ApplicationController
  before_action :authenticate_user!

  def show
    @proposal = Proposal.find(params[:id])
  end

  # GET /parking_spaces/:p_sp_id/proposals.json
  def index
    @proposals = Proposal.where parking_space_id: params[:parking_space_id]

    @proposal = Proposal.with_messages (1)


  end

  def reject
    @proposal = Proposal.find(params[:proposal_id])
    owner_deviceid = current_user.device_id

    respond_to do |format|
      if @proposal.reject(owner_deviceid)
        notify_proposal_owner_reject @proposal
        format.json { render :show, status: :ok }
      else
        format.json { render json: {Error: @proposal.errors}, status: :unprocessable_entity }
      end
    end
  end

  def approve
    @proposal = Proposal.find(params[:proposal_id])
    owner_deviceid = current_user.device_id

    respond_to do |format|
      if @proposal.approve(owner_deviceid)
        notify_proposal_owner_approve @proposal
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

    @proposal.deviceid = current_user.device_id
    @proposal.bidder_name = current_user.full_name
    @proposal.phone_number = current_user.phone_number


    respond_to do |format|
      if @proposal.save
        notify_space_owner @proposal
        format.json { render :show, status: :created }
      else
        format.json { render json: {Error: @proposal.errors}, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /parking_spaces/:p_sp_id/proposals
  # PATCH/PUT /parking_spaces/:p_sp_id/proposals.json
  def update
    @proposal = Proposal.find(params[:id])

    if current_user.device_id != @proposal.deviceid
      render json: {Error: {general: "Device id invalid"}}, status: :unprocessable_entity
      return
    end

    respond_to do |format|
      if @proposal.update(proposal_params)
        format.json { render :show, status: :ok, location: parking_space_proposal_url(@proposal.parking_space_id, @proposal) }
      else
        format.json { render json: @proposal.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def proposal_params
    params.require(:proposal).permit(:deviceid, :phone_number, :title_message, :bid_amount, :bid_currency, :bidder_name, :approval_status, :parking_space_id)
  end

  private

  def notify_space_owner (proposal)
    owner_device_id = proposal.parking_space.deviceid
    space_owner = User.find_by_device_id owner_device_id

    data = {:aps => {:alert => 'You have an offer for your parking space',:badge => 9 , :sound => 'bingbong.aiff'},
            :message => 'You have an offer for your parking space',
            :area => :parking_space,
            :parking_space => proposal.parking_space.id,
            :msgcnt => 1}

    send_notification(space_owner, data)
  end

  def notify_proposal_owner_approve(proposal)
    owner_device_id = proposal.deviceid
    proposal_owner = User.find_by_device_id owner_device_id
    data = {:aps => {:alert => 'Your parking space offer has been accepted',:badge => 9 , :sound => 'bingbong.aiff'},
            :message => 'Your parking space offer has been accepted',
            :area => :offer,
            :offer => proposal.id,
            :msgcnt => 1}

    send_notification(proposal_owner, data)
  end

  def notify_proposal_owner_reject(proposal)
    owner_device_id = proposal.deviceid
    proposal_owner = User.find_by_device_id owner_device_id
    data = {:aps => {:alert => 'Your parking space offer has been rejected',:badge => 9 , :sound => 'bingbong.aiff'},
            :message => 'Your parking space offer has been rejected',
            :area => :offer,
            :offer => proposal.id,
            :msgcnt => 1}

    send_notification(proposal_owner, data)
  end

  def send_notification(destination_user, data)
    begin
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
end
