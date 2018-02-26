class ParkingSpacesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_parking_space, only: [:phone_number, :show, :update, :destroy]
  respond_to :json

  # GET /parking_spaces
  # GET /parking_spaces.json
  def index
    lat_min = params[:lat_min]
    lat_max = params[:lat_max]
    lon_min = params[:lon_min]
    lon_max = params[:lon_max]


    unless lat_min && lon_min && lat_max && lon_max
      render json: {Error: {general: "Missing parameters 'lat' or 'lon' min/max"}}, status: :unprocessable_entity
      return
    end

    query_attrs = {lon_min: lon_min, lon_max: lon_max, lat_min: lat_min, lat_max: lat_max}
    @parking_spaces = ParkingSpace.not_expired.active
                          .includes(:proposals)
                          .within_boundaries(query_attrs)
  end


  # GET /parking_spaces/1/phone_number
  def phone_number
    render json: {number: User.find_by_device_id(@parking_space.deviceid).phone_number}, status: :ok
  end

  # GET /parking_spaces/1
  # GET /parking_spaces/1.json
  def show
  end


  def myspaces
    deviceid = current_user.device_id

    unless deviceid
      render json: {Error: {general: "Missing deviceid"}}, status: :unprocessable_entity
      return
    end

    @parking_spaces = ParkingSpace.not_expired.active
                          .includes(:proposals)
                          .where({deviceid: deviceid})

    @parking_spaces.each do |space|
      space.owner = User.find_by_device_id deviceid
    end

    respond_to do |format|
      format.json {render :index, status: :ok}
    end
  end

  def myoffers
    deviceid = current_user.device_id

    unless deviceid
      render json: {Error: {general: "Missing deviceid"}}, status: :unprocessable_entity
      return
    end

    @parking_spaces = ParkingSpace.not_expired.active
                          .includes(:proposals)
                          .where(proposals: {deviceid: deviceid})

    @parking_spaces.each do |space|
      space.owner = User.find_by_device_id space.deviceid
    end

    respond_to do |format|
      format.json {render :index, status: :ok}
    end
  end

  # GET /parking_spaces/1/mark_offers_as_read
  def mark_offers_as_read
    parking_space_id = params[:parking_space_id]
    @parking_space = ParkingSpace.find(parking_space_id)

    if @parking_space.proposals
      @parking_space.proposals.update_all(read: true)
    end

    @parking_space = ParkingSpace.includes(:proposals).find(parking_space_id)


    respond_to do |format|
      format.json {render :show, status: :ok}
    end
  end

  # POST /parking_spaces
  # POST /parking_spaces.json
  def create
    @parking_space = ParkingSpace.new(parking_space_params)
    @parking_space.deviceid = current_user.device_id
    @parking_space.owner_name = current_user.full_name

    respond_to do |format|
      if @parking_space.save
        format.json {render :show, status: :created, location: @parking_space}
      else
        format.json {render json: {Error: @parking_space.errors}, status: :unprocessable_entity}
      end
    end
  end

  # PATCH/PUT /parking_spaces/1
  # PATCH/PUT /parking_spaces/1.json
  def update

    if current_user.device_id != @parking_space.deviceid
      render json: {Error: {general: "Device id invalid"}}, status: :unprocessable_entity
      return
    end

    respond_to do |format|
      if @parking_space.update(parking_space_params)
        format.json {render :show, status: :ok, location: @parking_space}
      else
        format.json {render json: {Error: @parking_space.errors}, status: :unprocessable_entity}
      end
    end
  end

  # DELETE /parking_spaces/1
  # DELETE /parking_spaces/1.json
  def destroy
    if current_user.device_id != @parking_space.deviceid
      render json: {Error: {general: "Device id invalid"}}, status: :unprocessable_entity
      return
    end
    @parking_space.destroy
    respond_to do |format|
      format.json {head :no_content}
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_parking_space
    if params[:id].nil?
      @parking_space = ParkingSpace.find(params[:parking_space_id])
    else
      @parking_space = ParkingSpace.find(params[:id])
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def parking_space_params
    params.require(:parking_space).permit(:location_lat, :location_long,
                                          :recorded_from_lat, :recorded_from_long,
                                          :deviceid, :target_price, :target_price_currency,
                                          :phone_number, :owner_name, :title,
                                          :address_line_1, :address_line_2,
                                          :space_availability_start, :space_availability_stop,
                                          :file1, :file2, :file3,
                                          :daily_start, :daily_stop, :weekly_schedule,
                                          :description, :created_at)
  end
end
