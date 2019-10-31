class RulesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_rule, only: [:show, :edit, :update, :destroy]

  # GET /rules
  # GET /rules.json
  def index
    if !params[:ids].nil?
      ids = params[:ids].split ","
      @rules = Rule.find(ids)
    else
      if params[:query].nil? or params[:query].length < 2
        @rules = []
      else
        @rules = Rule.with_query(params[:query])
      end
    end
  end

  # GET /rules/1
  # GET /rules/1.json
  def show
  end

  # GET /rules/new
  def new
    @rule = Rule.new
  end

  # GET /rules/1/edit
  def edit
  end

  # POST /rules
  # POST /rules.json
  def create
    @rule = Rule.new(rule_params)

    respond_to do |format|
      if @rule.save
        format.json { render :show, status: :created, location: @rule }
      else
        format.json { render json: @rule.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /rules/1
  # PATCH/PUT /rules/1.json
  def update
    respond_to do |format|
      if @rule.update(rule_params)
        format.json { render :show, status: :ok, location: @rule }
      else
        format.json { render json: @rule.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /rules/1
  # DELETE /rules/1.json
  def destroy
    @rule.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_rule
    @rule = Rule.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def rule_params
    params.require(:rule).permit(:description, :name, :start, :stop, :role)
  end
end
