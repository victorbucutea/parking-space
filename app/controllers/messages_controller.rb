class MessagesController < ApplicationController

  def create

    @message = Message.new(message_params)

    respond_to do |format|
      if @message.save
        @proposal = Proposal.with_messages message_params[:proposal_id]
        format.json { render 'proposals/show', status: :created }
      else
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
  end

  def message_params
    params.require(:message).permit(:deviceid, :content, :proposal_id)
  end
end
