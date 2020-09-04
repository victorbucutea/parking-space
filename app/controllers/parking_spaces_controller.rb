# frozen_string_literal: true

class ParkingSpacesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource
  before_action :set_parking_space, only: %i[documents show update destroy attach_documents validate attach_images]
  respond_to :json

  # GET /parking_spaces
  # GET /parking_spaces.json
  def index

    lat_min = params[:lat_min]
    lat_max = params[:lat_max]
    lon_min = params[:lon_min]
    lon_max = params[:lon_max]

    unless lat_min && lon_min && lat_max && lon_max
      render json: { Error: { general: "Missing parameters 'lat' or 'lon' min/max" } }, status: :unprocessable_entity
      return
    end

    query_attrs = { lon_min: lon_min, lon_max: lon_max, lat_min: lat_min, lat_max: lat_max }
    @parking_spaces = ParkingSpace.not_expired.active_or_owned(current_user)
                          .includes(:user, :images)
                          .within_boundaries(query_attrs)
  end

  # GET /parking_spaces/1
  # GET /parking_spaces/1.json
  def show; end

  def myspaces
    @parking_spaces = @parking_spaces.includes(:proposals, :images, :user)
    render :myspaces, status: :ok
  end

  def list_spaces
    @parking_spaces = ParkingSpace.includes(:proposals, :images, :user, proposals: :user)
                          .where(user: params[:user_id])
    render :myspaces, status: :ok
  end

  def myoffers
    @parking_spaces = ParkingSpace.includes(:proposals, :images, :user, proposals: :user)
                          .where(proposals: { user: current_user })
    render :myspaces, status: :ok
  end

  def list_offers
    @parking_spaces = ParkingSpace.includes(:images, :user, proposals: :user)
                          .where(proposals: { user: params[:user_id] })
    render :myspaces, status: :ok
  end

  def attach_documents
    docs = params[:docs]

    @parking_space.documents.destroy_all
    # save to parking_space_documents
    @docs = []
    docs.each do |d|
      doc = @parking_space.documents.create(file: d[:file], name: d[:name], resource_type: d[:type],
                                            comment: 'User upload', status: 'uploaded')
      unless doc.errors.empty?
        return render json: { Error: doc.errors }, status: :unprocessable_entity
      end

      @docs << doc
    end

    render :documents, status: :ok
  end

  def documents
    @docs = Document.where(parking_space_id: @parking_space)
  end

  def attach_images
    imgs = params[:imgs]

    @parking_space.images.destroy_all
    # save to parking_space_documents
    imgs.each do |d|
      img = @parking_space.images.create(image: d[:file], name: d[:name], comment: 'User upload')
      unless img.errors.empty?
        return render json: { Error: img.errors }, status: :unprocessable_entity
      end
    end

    render :show, status: :created, location: @parking_space
  end

  def validate
    @parking_space.validated!
    UserMailer.with(space: @parking_space).validate_space.deliver_later
  end

  # POST /parking_spaces
  # POST /parking_spaces.json
  def create
    @parking_space = ParkingSpace.new(parking_space_params)
    @parking_space.user = current_user

    if @parking_space.save
      UserMailer.with(space: @parking_space).new_space.deliver_later
      render :show, status: :created, location: @parking_space
    else
      render json: { Error: @parking_space.errors }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /parking_spaces/1
  # PATCH/PUT /parking_spaces/1.json
  def update
    if @parking_space.update(parking_space_params)
      render :show, status: :ok, location: @parking_space
    else
      render json: { Error: @parking_space.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /parking_spaces/1
  # DELETE /parking_spaces/1.json
  def destroy
    # TODO: do not delete just expire validity
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
                                          :target_price, :target_price_currency,
                                          :phone_number, :owner_name, :title, :comment,
                                          :address_line_1, :address_line_2, :status,
                                          :space_availability_start, :space_availability_stop,
                                          :daily_start, :daily_stop, :weekly_schedule, :description)
  end
end
