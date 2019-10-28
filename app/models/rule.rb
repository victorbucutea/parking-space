class Rule < ActiveRecord::Base

  scope :with_query, -> (desc) { where('rules.description like ?
                                      or rules.name like ? ',"%#{desc}%", "%#{desc}%")}

  def check(proposal)
    true;
  end
end

class TimeBeforeReservationRule < Rule

  def check(proposal)
  end
end

class ReservationDurationRule < Rule

  def check(proposal)

  end
end

class WorkingHoursRule < Rule

  def check(proposal)

  end
end

class OrRule < Rule
  def check(proposal)

  end
end
class AndRule < Rule
  def check(proposal)

  end
end
