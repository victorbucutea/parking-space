class ProposalsController < ApplicationController

  def show
    @proposal = Proposal.find(params[:id])
  end

  # GET /parking_spaces/:p_sp_id/proposals.json
  def index
    @proposals = Proposal.where parking_space_id: params[:parking_space_id]
  end

  # POST /parking_spaces/:p_sp_id/proposals
  # POST /parking_spaces/:p_sp_id/proposals.json
  def create
    @proposal = Proposal.new(proposal_params)

    respond_to do |format|
      if @proposal.save
        format.json { render :show, status: :created, location: parking_space_proposal_url(@proposal) }
      else
        format.json { render json: @proposal.errors, status: :unprocessable_entity }
      end
    end
  end


  private

  # Never trust parameters from the scary internet, only allow the white list through.
  def proposal_params
    params.require(:proposal).permit(:deviceid, :title_message, :bid_amount, :bid_currency, :win_flag)
  end
end
