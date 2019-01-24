require 'pusher'

class SensorsController < ApplicationController
  before_action :set_sensor, only: [:show, :edit, :update, :destroy]

  # GET /sensors
  # GET /sensors.json
  def index
    @sensors = Sensor.all
  end

  # GET /sensors
  # GET /sensors/with_location.json
  def with_location
    @sensors = Sensor.all.includes(:sensor_location).includes :parking_perimeters
    respond_to do |format|
      format.json {render :with_location, status: :ok}
    end
  end

  # GET /sensors
  # GET /sensors/assigned.json
  def assigned
    @sensors = Sensor.for_location(params[:location_id])
    respond_to do |format|
      format.json {render :index, status: :ok}
    end
  end

  # GET /sensors/1
  # GET /sensors/1.json
  def show
  end

  # GET /sensors/new
  def new
    @sensor = Sensor.new
  end

  # GET /sensors/1/edit
  def edit
  end

  # POST /sensors
  # POST /sensors.json
  def create
    @sensor = Sensor.new(sensor_params)


    respond_to do |format|
      if @sensor.save
        format.json {render :show, status: :created, location: @sensor}
      else
        format.json {render json: @sensor.errors, status: :unprocessable_entity}
      end
    end
  end


  # POST /sensors
  # POST /sensors.json
  def snapshot
    sensor_id = params[:sensor_id]
    @sensor = Sensor.find(sensor_id)

    Pusher.trigger('sensor_channel', "console_#{sensor_id}",
                   {command: 'snapshot', params: {sensor: sensor_id}})

    respond_to do |format|
      format.json {render :index, status: :ok}
    end
  end


  # PATCH/PUT /sensors/1
  # PATCH/PUT /sensors/1.json
  def update
    respond_to do |format|
      if @sensor.update(sensor_params)
        format.json {render :show, status: :ok, location: @sensor}
      else
        format.json {render json: @sensor.errors, status: :unprocessable_entity}
      end
    end
  end


  # GET /sensors/:sensor_id/new_perimeter
  def new_perimeter
    @sensor = Sensor.find(params[:sensor_id])
  end

  def perimeters
    @sensor = Sensor.find(params[:sensor_id])
    @sensor.do_heartbeat
    respond_to do |format|
      format.json {render :'sensors/show_perimeters', status: :ok}
    end
  end

  # POST /sensors/1/save_perimeters.json
  def save_perimeters
    @sensor = Sensor.find(params[:sensor_id])
    pers = params[:perimeters]


    @sensor.parking_perimeters.each do |per|
      exists = false;
      pers.each do |incoming|
        exists = true if incoming[:id] == per.id
      end
      per.destroy unless exists
    end


    pers.each do |per|

      if per[:id].nil? || per[:id] <= 0
        perimeter = ParkingPerimeter.new(permiter_params(per))
        perimeter.save
      else
        perimeter = ParkingPerimeter.find(per[:id])
        perimeter.update(permiter_params(per))
      end

      @sensor.parking_perimeters << perimeter
    end

    respond_to do |format|
      format.json {render 'sensors/show_perimeters', status: :created}
    end

  end

  # POST /sensors/1/save_parking_spaces.json
  def publish_free_perimeters
    @sensor = Sensor.find(params[:sensor_id])

    @sensor.publish_spaces(params)
    respond_to do |format|
      format.json {render 'sensors/show_perimeters', status: :created}
    end

  end

  # DELETE /sensors/1
  # DELETE /sensors/1.json
  def destroy
    @sensor.destroy
    respond_to do |format|
      format.json {head :no_content}
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_sensor
    @sensor = Sensor.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def sensor_params
    params.require(:sensor).permit(
        :deviceid, :title_message, :location_text, :lat, :lng,
        :sensor_location_id, :snapshot, :installation_date, :active,
        :hook_active, :module_info)
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def permiter_params(perim_params)
    perim_params.permit(
        :top_left_y, :top_left_x, :bottom_right_y, :bottom_right_x, :price,
        :identifier, :description, :perimeter_type, :lat, :lng, :correlation_threshold
    )
  end

end
