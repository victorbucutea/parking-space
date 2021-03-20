# frozen_string_literal: true

class SectionsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource

  before_action :set_section, only: %i[show edit update destroy]
  before_action :set_section_p, only: %i[save_perimeters perimeters]

  # GET /sections
  # GET /sections.json
  def index
    @sections = Section.all
  end

  # GET /sections/1
  # GET /sections/1.json
  def show; end

  # GET /sections/new
  def new
    @section = Section.new
  end

  # GET /sections/1/edit
  def edit; end

  # POST /sections
  # POST /sections.json
  def create
    @section = Section.new(section_params)

    if @section.save
      render :show, status: :created, location: @section
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sections/1
  # PATCH/PUT /sections/1.json
  def update
    if @section.update(section_params)
      render :show, status: :ok, location: @section
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  # DELETE /sections/1
  # DELETE /sections/1.json
  def destroy
    @section.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  def perimeters
    respond_to do |format|
      format.json { render 'sections/show_perimeters', status: :ok }
    end
  end

  def save_perimeters
    pers = perimeter_params[:perimeters]
    sens = perimeter_params[:sensors]
    # remove all perimeters not present in submit
    @section.parking_perimeters.clear
    # remove links with sensor
    @section.sensors.clear
    pers.each { |per| ParkingPerimeter.find_or_create_by(per[:id]).update per }
    sens.each { |sen| Sensor.find(sen[:id]).update sen }

    render 'sections/show_perimeters', status: :created
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_section
    @section = Section.find(params[:id])
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_section_p
    @section = Section.find(params[:section_id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def section_params
    params.require(:section).permit(:name, :description, :location_id, :interior_map)
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def perimeter_params
    params.permit(perimeters: %i[
                    id top_left_y top_left_x bottom_right_y bottom_right_x price
                    identifier description perimeter_type lat lng section_id
                    rules_expression user_id],
                  sensors: %i[id top_left_y top_left_x section_id]
    )
  end
end
