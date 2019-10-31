class LocationsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource
  skip_authorize_resource :only => :create
  before_action :set_sensor_location, only: [:show, :edit, :update, :destroy]

  # GET /locations
  # GET /locations.json
  def index
    @locations = Location.accessible_by(current_ability)
  end

  # GET /locations/1
  # GET /locations/1.json
  def show
  end

  # GET /locations/new
  def new
    @location = Location.new
  end

  # GET /locations/1/edit
  def edit
  end

  # POST /locations
  # POST /locations.json
  def create
    @location = Location.new(location_params)
    @location.company = current_user.company
    if @location.company.nil?
      render json: {Error: 'You must be company admin to create locations and sections'}, status: :forbidden
      return
    end

    respond_to do |format|
      if @location.save
        format.json {render :show, status: :created, location: @location}
      else
        format.json {render json: @location.errors, status: :unprocessable_entity}
      end
    end
  end

  # PATCH/PUT /locations/1
  # PATCH/PUT /locations/1.json
  def update
    respond_to do |format|
      if @location.update(location_params)
        format.json {render :show, status: :ok, location: @location}
      else
        format.json {render json: @location.errors, status: :unprocessable_entity}
      end
    end
  end

  # DELETE /locations/1
  # DELETE /locations/1.json
  def destroy
    @location.destroy
    respond_to do |format|
      format.json {head :no_content}
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_sensor_location
    @location = Location.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def location_params
    params.require(:location).permit(
        :location_lat, :location_long, :name, :parking_space_name, :address)
  end
end
