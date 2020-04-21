class ParametersController < ApplicationController
  before_action :set_parameter, only: [:show, :edit, :update, :destroy]

  # GET /parameters
  # GET /parameters.json
  def index
    @parameters = Parameter.all.includes(:parameter_values)
  end

  # GET /parameters/1
  # GET /parameters/1.json
  def show

  end

  # GET /parameters/new
  def new
    @parameter = Parameter.new
  end

  # GET /parameters/1/edit
  def edit
  end

  # POST /parameters
  # POST /parameters.json
  def create
    @parameter = Parameter.new(parameter_params)

    if @parameter.save
      format.json { render :show, status: :created, location: @parameter }
    else
      format.json { render json: @parameter.errors, status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /parameters/1
  # PATCH/PUT /parameters/1.json
  def update
    if @parameter.update(parameter_params)
      format.json { render :show, status: :ok, location: @parameter }
    else
      format.json { render json: @parameter.errors, status: :unprocessable_entity }
    end
  end

  # DELETE /parameters/1
  # DELETE /parameters/1.json
  def destroy
    @parameter.destroy
    format.json { head :no_content }
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_parameter
    @parameter = Parameter.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def parameter_params
    params.require(:parameter).permit(:name, :default_value)
  end

end
