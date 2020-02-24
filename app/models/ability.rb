# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)

    if user.has_role 'city_admin'
      can :manage, ParkingSpace
    else
      can :manage, ParkingSpace, user_id: user.id
    end

    can :index, ParkingSpace
    can :phone_number, ParkingSpace

    if user.has_role 'parking_lot_admin'
      can [:read, :update], Location, roles: {user_id: user.id}
      can :manage, Section, location: {roles: {user_id: user.id}}
    end


    if user.has_role 'company_admin'
      can :manage, Company, roles: {user_id: user.id}
      can :manage, Company, id: user.company_id
      can :manage, Location, company: {roles: {user_id: user.id}}
      can :manage, Section, location: {company: {roles: {user_id: user.id}}}
    end


    if user.has_role 'city_admin'
      can :manage, Role
      can :manage, Location
      can :manage, Company
      can :manage, Section
    end

    # TODO add  for location
    #       render json: {Error: 'You must be company admin to create locations and sections'}, status: :forbidden

  end
end

