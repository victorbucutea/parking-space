class ParkingSpacesController < ApplicationController
  before_action :set_parking_space, only: [:show, :update, :destroy]
  respond_to :json

  # GET /parking_spaces
  # GET /parking_spaces.json
  def index

    #TODO move validation to model
    lat = !params[:lat] || params[:lat].empty? ? nil : params[:lat]
    lon = !params[:lon] || params[:lon].empty? ? nil : params[:lon]
    range =!params[:range] || params[:range].empty? ? nil : params[:range]


    unless lat && lon && range
      render json: {:Error => "Missing parameters 'lat', 'lon' and 'range'"}, status: :unprocessable_entity
      return
    end

    if range.to_i > SysParams.instance.get_i('max_search_radius')
      render json: {:Error => "Cannot have a range larger than 1200"}, status: :unprocessable_entity
      return
    end

    cur_lat = lat.to_f
    cur_long = lon.to_f
    cur_range = range.to_f

    lat_range_in_deg = DegreeToMeters.from_meters_to_lat_deg cur_range
    lat_max = cur_lat + lat_range_in_deg
    lat_min = cur_lat - lat_range_in_deg

    long_range_in_deg = DegreeToMeters.from_meters_to_long_deg cur_range
    lon_max = cur_long + long_range_in_deg
    lon_min = cur_long - long_range_in_deg

    query_attrs = {lon_min: lon_min, lon_max: lon_max, lat_min: lat_min, lat_max: lat_max}
    # add short term
    @parking_spaces = ParkingSpace.short_term.within_boundaries(query_attrs).includes(proposals: [:messages])
    # add long term
    @parking_spaces += ParkingSpace.long_term.within_boundaries(query_attrs).includes(proposals: [:messages])
  end

  # GET /parking_spaces/1
  # GET /parking_spaces/1.json
  def show
  end


  def myevents
    deviceid = session[:deviceid]

    unless deviceid
      render json: {:Error => "Missing deviceid"}, status: :unprocessable_entity
      return
    end

    all_spaces_proposed = ParkingSpace.includes(proposals: [:messages]).where(proposals: {deviceid: deviceid})
    @parking_spaces = ParkingSpace.includes(proposals: [:messages]).where({deviceid: deviceid})

    @parking_spaces += all_spaces_proposed

    respond_to do |format|
      format.json { render :index, status: :ok }
    end
  end

  # POST /parking_spaces
  # POST /parking_spaces.json
  def create
    @parking_space = ParkingSpace.new(parking_space_params)
    respond_to do |format|
      if @parking_space.save
        format.json { render :show, status: :created, location: @parking_space }
      else
        format.json { render json: {:Error => @parking_space.errors}, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /parking_spaces/1
  # PATCH/PUT /parking_spaces/1.json
  def update
    unless parking_space_params['deviceid']
      render json: {:Error => "Device id is required"}, status: :unprocessable_entity
      return
    end

    respond_to do |format|
      if @parking_space.update(parking_space_params)
        format.json { render :show, status: :ok, location: @parking_space }
      else
        format.json { render json: @parking_space.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /parking_spaces/1
  # DELETE /parking_spaces/1.json
  def destroy
    unless params[:parking_space]
      render json: {:Error => "Device id is required"}, status: :unprocessable_entity
      return
    end

    if params[:parking_space]['deviceid'] != @parking_space.deviceid
      render json: {:Error => "Device id invalid"}, status: :unprocessable_entity
      return
    end
    @parking_space.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_parking_space
    @parking_space = ParkingSpace.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def parking_space_params
    params.require(:parking_space).permit(:location_lat, :location_long,
                                          :recorded_from_lat, :recorded_from_long,
                                          :deviceid, :target_price, :target_price_currency,
                                          :interval, :phone_number,
                                          :owner_name, :image_file_name, :image_content_type,
                                          :image_file_size, :title,
                                          :address_line_1, :address_line_2,
                                          :image_data,
                                          :thumbnail_data,
                                          :rotation_angle,
                                          :description)
  end
end
