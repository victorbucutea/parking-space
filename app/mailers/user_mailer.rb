class UserMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.new_space.subject
  #
  def new_space
    @space = params[:space]
    mail to: @space.user.email, subject: 'Ai postat un loc de parcare!'
  end

  # on space validation
  def validate_space
    @space = params[:space]
    mail to: @space.user.email, subject: 'Locul tău a devenit disponibil!'
  end

  # on space requires review
  def additional_info_space
    @space = params[:space]
    #
    mail to: @space.user.email, subject: 'Locul tău necesită revizuire!'
  end

  # Sent to space ownerr for being notified of reservation
  def new_offer
    @proposal = params[:proposal]
    @period = time_diff(@proposal.start_date, @proposal.end_date)
    mail to: @proposal.parking_space.user.email, subject: 'Ai o rezervare nouă!'
  end

  # Sent to reservation owner for being notified and also add event to calendar
  def reservation_notif
    @proposal = params[:proposal]
    location = @proposal.parking_space.address_line_1 + "\n" + @proposal.parking_space.address_line_2
    summary = 'Rezervare loc parcare'
    ical = calendar_file summary, location, @proposal.start_date, @proposal.end_date
    mail.attachments['reservation.ics'] = {mime_type: 'text/calendar', content: ical}
    mail to: @proposal.user.email, subject: 'Rezervare loc parcare'
  end

  def offer_cancel
    @proposal = params[:proposal]
    @subject = @proposal.rejected? ? 'respinsă' : 'anulată'
    mail to: @proposal.user.email, subject: 'Rezervare ' + @subject
  end

  def withdrawal
    @withdrawal = params[:withdrawal]
    mail to: @withdrawal.account.user.email, subject: 'Retragere'
  end

  def welcome
    # what to write here ?
    # house rules
    # instructions on type of spaces
    # Cum rezerv / cum postez
  end

  private

  def time_diff(start_time, end_time)
    seconds_diff = (start_time - end_time).to_i.abs

    hours = seconds_diff / 3600
    seconds_diff -= hours * 3600

    minutes = seconds_diff / 60

    "#{hours.to_s.rjust(2, '0')}h #{minutes.to_s.rjust(2, '0')}m"
  end

  def calendar_file(summary, location, start, stop)
    ical = Icalendar::Calendar.new
    e = Icalendar::Event.new
    e.dtstart = Icalendar::Values::DateTime.new start
    e.dtend = Icalendar::Values::DateTime.new stop
    e.location = location
    e.summary = summary
    # e.description = desc
    ical.add_event(e)
    ical.to_ical
  end
end