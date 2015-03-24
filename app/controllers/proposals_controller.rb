class ProposalsController < ApplicationController

  def show
    @proposal = Proposal.find(params[:id])
  end

  # GET /parking_spaces/:p_sp_id/proposals.json
  def index
    @proposals = Proposal.where parking_space_id: params[:parking_space_id]
  end

  def reject
    @proposal = Proposal.find(params[:proposal_id])
    owner_deviceid = session[:deviceid]

    respond_to do |format|
      if @proposal.reject(owner_deviceid)
        format.json { render :show, status: :ok}
      else
        format.json { render json: {Error: @proposal.errors}, status: :unprocessable_entity }
      end
    end

  end

  def approve
    @proposal = Proposal.find(params[:proposal_id])
    owner_deviceid = session[:deviceid]

    respond_to do |format|
      if @proposal.approve(owner_deviceid)
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

    respond_to do |format|
      if @proposal.save
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

    if session[:deviceid] != @proposal.deviceid
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
end
