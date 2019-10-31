# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)


    if user.has_role 'parking_lot_admin'
      can [:read, :update], Location, roles: {user_id: user.id}
      can :manage, Section, location: { roles: {user_id: user.id}}
    end


    if user.has_role 'company_admin'
      can :manage, Company, roles: {user_id: user.id}
      can :manage, Location, company: {roles: {user_id: user.id}}
      can :manage, Section, location: {company: { roles: {user_id: user.id}}}
    end


    if user.has_role 'city_admin'
      can :manage, Role
      can :manage, Location
      can :manage, Company
      can :manage, Section
    end
  end
end

