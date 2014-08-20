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
    owner_deviceid = params[:reject][:owner_deviceid]

    respond_to do |format|
      if @proposal.reject(owner_deviceid)
        format.json { render :show, status: :ok, location: parking_space_proposal_url(@proposal.parking_space_id, @proposal) }
      else
        format.json { render json: @proposal.errors, status: :unprocessable_entity }
      end
    end

  end

  def approve
    @proposal = Proposal.find(params[:proposal_id])
    owner_deviceid = params[:approve][:owner_deviceid]

    respond_to do |format|
      if @proposal.approve(owner_deviceid)
        format.json { render :show, status: :ok, location: parking_space_proposal_url(@proposal.parking_space_id, @proposal) }
      else
        format.json { render json: @proposal.errors, status: :unprocessable_entity }
      end
    end

  end

  # POST /parking_spaces/:p_sp_id/proposals
  # POST /parking_spaces/:p_sp_id/proposals.json
  def create
    @proposal = Proposal.new(proposal_params)

    respond_to do |format|
      if @proposal.save
        format.json { render :show, status: :created, location: parking_space_proposal_url(@proposal.parking_space_id, @proposal) }
      else
        format.json { render json: @proposal.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /parking_spaces/:p_sp_id/proposals
  # PATCH/PUT /parking_spaces/:p_sp_id/proposals.json
  def update
    #TODO there must be a cleaner way to validate a missing incoming param
    unless proposal_params['deviceid']
      render json: {:Error => "Device id is required"}, status: :unprocessable_entity
      return
    end

    @proposal = Proposal.find(params[:id])

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
    params.require(:proposal).permit(:deviceid, :title_message, :bid_amount, :bid_currency, :bidder_name, :status, :parking_space_id)
  end
end
