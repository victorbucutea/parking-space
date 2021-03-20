# frozen_string_literal: true

class SensorsController < ApplicationController
  before_action :set_sensor, only: %i[show edit update destroy]
  before_action :set_sensor_p, only: %i[snapshot perimeters
                                        do_heartbeat publish_free_perimeters
                                        save_perimeters]

  # GET /sensors
  # GET /sensors.json
  def index
    @sensors = Sensor.all
  end

  # GET /sensors
  # GET /sensors/with_location.json
  def with_location
    @sensors = Sensor.all.includes :parking_perimeters
    render :with_location
  end

  # GET /sensors
  # GET /sensors/assigned.json
  def assigned
    @sensors = Sensor.for_section(params[:location_id])
    render :index
  end

  # GET /sensors/1
  # GET /sensors/1.json
  def show; end

  # GET /sensors/new
  def new
    @sensor = Sensor.new
  end

  # GET /sensors/1/edit
  def edit; end

  # POST /sensors
  # POST /sensors.json
  def create
    @sensor = Sensor.new(sensor_params)

    if @sensor.save
      render :show, status: :created, location: @sensor
    else
      render json: @sensor.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sensors/1
  # PATCH/PUT /sensors/1.json
  def update
    if @sensor.update(sensor_params)
      render :show, status: :ok, location: @sensor
    else
      render json: @sensor.errors, status: :unprocessable_entity
    end
  end

  def perimeters
    render :'sensors/show_perimeters'
  end

  def do_heartbeat
    @sensor.do_heartbeat
    render :'sensors/show_perimeters'
  end

  # POST /sensors/1/save_perimeters.json
  def save_perimeters
    pers = params[:perimeters]
    @sensor.parking_perimeters.each do |per|
      exists = false
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

    render 'sensors/show_perimeters', status: :created
  end

  # POST /sensors/1/save_parking_spaces.json
  def publish_free_perimeters
    @sensor.publish_spaces(params)
    render 'sensors/show_perimeters', status: :created
  end

  # DELETE /sensors/1
  # DELETE /sensors/1.json
  def destroy
    @sensor.destroy
    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_sensor
    @sensor = Sensor.find(params[:id])
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_sensor_p
    @sensor = Sensor.find(params[:sensor_id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def sensor_params
    params.require(:sensor).permit(
        :deviceid, :title_message, :location_text, :lat, :lng,
        :sensor_location_id, :snapshot, :installation_date, :active
    )
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def permiter_params(perim_params)
    perim_params.permit(
        :top_left_y, :top_left_x, :bottom_right_y, :bottom_right_x, :price,
        :identifier, :description, :perimeter_type, :lat, :lng
    )
  end
end
