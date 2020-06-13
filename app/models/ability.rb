# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)

    if user.role? 'city_admin'
      can :manage, Role
      can :manage, Location
      can :manage, Company
      can :manage, Section
      can :manage, ParkingSpace
      can :manage, Proposal
      can :manage, Account
    else
      can :manage, ParkingSpace, user_id: user.id
      can :manage, Proposal, user_id: user.id
    end

    if user.role? 'private_spaces_admin'
      # check private_spaces_admin allowed to validate parking space ( not user )
      # when city will be added (pb fk in roles) this role will only
      # manage parking spaces and reservations in that city
      can :manage, ParkingSpace
      can :manage, Proposal
      can :manage, Account
    end

    can :index, ParkingSpace
    can :show, ParkingSpace

    if user.role? 'parking_lot_admin'
      can %i[read update], Location, roles: { user_id: user.id }
      can :manage, Section, location: { roles: { user_id: user.id } }
    end


    if user.role? 'company_admin'
      can :manage, Company, roles: { user_id: user.id }
      can :manage, Company, id: user.company_id
      can :manage, Location, company: { roles: { user_id: user.id } }
      can :manage, Section, location: { company: { roles: { user_id: user.id } } }
    end


  end
end

