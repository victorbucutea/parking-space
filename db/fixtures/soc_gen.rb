# frozen_string_literal: true

Company.seed(:short_name) do |c|
  c.id = 1
  c.name = 'SOCIETE GENERALE EUROPEAN BUSINESS SERVICES SA '
  c.address = 'West Gate Park, Strada Preciziei nr. 24, cladirea H4, etaj 5, sector 6 013981, Bucuresti, Romania'
  c.cui = '27883477'
  c.registry = 'J40/151/2011'
  c.short_name = 'SG EBS'
  c.logo = 'logosgebs.png'
end

User.seed(:email) do |user|
  user.full_name = 'Victor-Florin Bucutea'
  user.password = 'pasword123'
  user.password_confirmation = 'pasword123'
  user.company_id = 1
end

User.seed(:email) do |user|
  user.full_name = 'Sorin Diaconescu'
  user.email = 'sorin.diaconescu-ext@socgen.com'
  user.password = 'pasword123'
  user.password_confirmation = 'pasword123'
  user.company_id = 1
end

User.seed(:email) do |user|
  user.full_name = 'Marius Dumitrescu'
  user.email = 'marius.dumitrescu-ext@socgen.com'
  user.password = 'pasword123'
  user.password_confirmation = 'pasword123'
  user.company_id = 1
end

User.seed(:email) do |user|
  user.full_name = 'Catalin Lupsa'
  user.email = 'catalin.lupsa-ext@socgen.com'
  user.password = 'pasword123'
  user.password_confirmation = 'pasword123'
  user.company_id = 1
end

User.seed(:email) do |user|
  user.full_name = 'Alexandru-Cosmin Ivan'
  user.email = 'alexandru-cosmin.ivan-ext@socgen.com'
  user.password = 'pasword123'
  user.password_confirmation = 'pasword123'
  user.company_id = 1
end

User.seed(:email) do |user|
  user.full_name = 'Constantin Agapi'
  user.email = 'constantin.agapi-ext@socgen.com'
  user.password = 'pasword123'
  user.password_confirmation = 'pasword123'
  user.company_id = 1
end

Role.seed(:id,
          { id: 1, identifier: 'sensor_admin' },
          { id: 2, identifier: 'city_admin' },
          { id: 3, identifier: 'company_id_admin' },
          { id: 4, identifier: 'parking_lot_admin' },
          { id: 5, identifier: 'parking_lot_viewer' },
          id: 6, identifier: 'private_spaces_admin')


Rule.seed(:id, { id: 1,
                description: 'Rezervarea locului se poate face doar cu 1h inaintea ocuparii locului.',
                name: 'Rezervare doar cu 1h inainte',
                start: 60,
                stop: 0,
                type: 'TimeBeforeReservationRule' },
          { id: 2,
           description: 'Rezervarea locului se poate face doar cu 1.5h inaintea ocuparii locului.',
           name: 'Rezervare doar cu 1.5h inainte',
           start: 90,
           stop: 0,
           type: 'TimeBeforeReservationRule' },
          { id: 3,
           description: 'Rezervarea locului se poate face doar cu 3h inaintea ocuparii locului.',
           name: 'Rezervare doar cu 3h inainte',
           start: 180,
           stop: 0,
           type: 'TimeBeforeReservationRule' },
          { id: 4,
           description: 'Durata maxima de rezervare a locului e de maxim 8h.',
           name: 'Durata rezervare 8h',
           start: 0,
           stop: 60 * 8,
           type: 'ReservationDurationRule' },
          { id: 5,
           description: 'Durata maxima de rezervare a locului e de maxim 12h.',
           name: 'Durata rezervare 12h',
           start: 0,
           stop: 60 * 12,
           type: 'ReservationDurationRule' },
          { id: 6,
           description: 'Rezervare doar in intervalul orelor lucratoare, incluzand week-end',
           name: 'Ore lucratoare cu weekend',
           start: 0,
           stop: 60,
           type: 'WorkingHoursRule' },
           id: 7,
           description: 'Rezervare doar in intervalul orelor lucratoare, excluzand week-end',
           name: 'Ore lucratoare fara weekend',
           start: 0,
           stop: 60,
           type: 'WorkingHoursRule' )
