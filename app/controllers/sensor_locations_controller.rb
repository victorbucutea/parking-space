class SensorLocationsController < ApplicationController
  before_action :set_sensor_location, only: [:show, :edit, :update, :destroy]

  # GET /sensor_locations
  # GET /sensor_locations.json
  def index
    @sensor_locations = SensorLocation.all
  end

  # GET /sensor_locations/1
  # GET /sensor_locations/1.json
  def show
  end

  # GET /sensor_locations/new
  def new
    @sensor_location = SensorLocation.new
  end

  # GET /sensor_locations/1/edit
  def edit
  end

  # POST /sensor_locations
  # POST /sensor_locations.json
  def create
    @sensor_location = SensorLocation.new(sensor_location_params)

    respond_to do |format|
      if @sensor_location.save
        format.json {render :show, status: :created, location: @sensor_location}
      else
        format.json {render json: @sensor_location.errors, status: :unprocessable_entity}
      end
    end
  end

  # PATCH/PUT /sensor_locations/1
  # PATCH/PUT /sensor_locations/1.json
  def update
    respond_to do |format|
      if @sensor_location.update(sensor_location_params)
        format.json {render :show, status: :ok, location: @sensor_location}
      else
        format.json {render json: @sensor_location.errors, status: :unprocessable_entity}
      end
    end
  end

  # DELETE /sensor_locations/1
  # DELETE /sensor_locations/1.json
  def destroy
    @sensor_location.destroy
    respond_to do |format|
      format.json {head :no_content}
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_sensor_location
    @sensor_location = SensorLocation.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def sensor_location_params
    params.require(:sensor_location).permit(
        :location_lat, :location_long, :name, :parking_space_name, :address, :perimeter_type, :deviceid)
  end
end
