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
          type: 'WorkingHoursRule')


ParameterValue.seed(:key,
                    { parameter_id: 1, key: 'us', value: 5, value1: ' ', value2: 'Usd', value3: '+1', value4: 'United States of America', value5: '2,3,4,5,6,7,8,9', value6: '10', value7: '201 555 1234' },
                    { parameter_id: 1, key: 'ae', value3: '+971', value4: 'United Arab Emirates', value5: '50,52,54,55,56,58', value6: '9', value7: '50 123 4567' },
                    { parameter_id: 1, key: 'ca', value3: '+1', value4: 'Canada', value5: '2,3,4,5,6,7,8,9', value6: '10', value7: '506 234 5678' },
                    { parameter_id: 1, key: 'sa', value3: '+966', value4: 'Saudi Arabia', value5: '50,51,53,54,55,56,57,58,59', value6: '9', value7: '50 123 4567' },
                    { parameter_id: 1, key: 'fr', value3: '+33', value4: 'France', value5: '6,70,73,74,75,76,77,78', value6: '9', value7: '6 12 34 56 78' },
                    { parameter_id: 1, key: 'de', value3: '+49', value4: 'Germany', value5: '151,152,155,157,159,160,162,163,170,171,172,173,174,175,176,177,178,179', value6: '11', value7: '1512 3456789' },
                    { parameter_id: 1, key: 'sk', value3: '+421', value4: 'Slovakia', value5: '901,902,903,904,905,906,907,908,910,911,912,914,915,916,917,918,940,944,948,949,950,951', value6: '9', value7: '912 345 678' },
                    { parameter_id: 1, key: 'si', value3: '+386', value4: 'Slovenia', value5: '20,21,30,31,40,41,49,50,51,60,61,64,70,71', value6: '8', value7: '31 234 567' },
                    { parameter_id: 1, key: 'hu', value3: '+36', value4: 'Hungary', value5: '20,30,31,38,50,60,70', value6: '9', value7: '20 123 4567' },
                    { parameter_id: 1, key: 'au', value3: '+43', value4: 'Austria', value5: '650,660,664,676,680,677,681,688,699', value6: '13', value7: '677 1234567890' },
                    { parameter_id: 1, key: 'cz', value3: '+420', value4: 'Czech Republic', value5: '601,602,603,604,605,606,607,608,702,72,73,77,790', value6: '9', value7: '601 123 456' },
                    { parameter_id: 1, key: 'pl', value3: '+48', value4: 'Poland', value5: '50,45,51,53,57,60,66,69,72,73,78,79,88', value6: '9', value7: '512 345 678' },
                    { parameter_id: 1, key: 'ch', value3: '+41', value4: 'Switzerland', value5: '74,75,76,77,78,79', value6: '9', value7: '68 123 45 67' },
                    { parameter_id: 1, key: 'es', value3: '+34', value4: 'Spain', value5: '6,7', value6: '9', value7: '612 34 56 78' },
                    { parameter_id: 1, key: 'pt', value3: '+351', value4: 'Portugal', value5: '91,921,922,923', value6: '9', value7: '912 345 678' },
                    { parameter_id: 1, key: 'lu', value3: '+352', value4: 'Luxembourg', value5: '621,628,661,668,691,698', value6: '9', value7: '628 123 456' },
                    { parameter_id: 1, key: 'be', value3: '+32', value4: 'Belgium', value5: '45,46,47,48', value6: '9', value7: '451 23 45 67' },
                    { parameter_id: 1, key: 'nl', value3: '+31', value4: 'Netherlands', value5: '6', value6: '9', value7: '6 12345678' },
                    { parameter_id: 1, key: 'dk', value3: '+45', value4: 'Denmark', value5: '2,30,31,40,41,42,50,51,52,53,60,61,71,81', value6: '8', value7: '21 23 45 67' },
                    { parameter_id: 1, key: 'fi', value3: '+358', value4: 'Finland', value5: '50,4', value6: '9', value7: '41 2345678' },
                    { parameter_id: 1, key: 'lt', value3: '+370', value4: 'Lithuania', value5: '6', value6: '8', value7: '6123 4567' },
                    { parameter_id: 1, key: 'ee', value3: '+372', value4: 'Estonia', value5: '5', value6: '8', value7: '5123 4567' },
                    { parameter_id: 1, key: 'lv', value3: '+371', value4: 'Latvia', value5: '21,22,23,24,25,26,27,28,29', value6: '8', value7: '21 234 567' },
                    { parameter_id: 1, key: 'se', value3: '+46', value4: 'Sweden', value5: '70,71,72,73,79', value6: '9', value7: '70 123 45 67' },
                    { parameter_id: 1, key: 'ua', value3: '+380', value4: 'Ukraine', value5: '39,50,63,66,67,68,91,92,93,94,95,96,97,98', value6: '9', value7: '50 123 4567' },
                    { parameter_id: 1, key: 'gr', value3: '+30', value4: 'Greece', value5: '69', value6: '10', value7: '691 234 5678' },
                    { parameter_id: 1, key: 'it', value3: '+39', value4: 'Italy', value5: '31,32,33,34,35,36,37,38,39', value6: '10', value7: '312 345 6789' },
                    { parameter_id: 1, key: 'gb', value3: '+44', value4: 'United Kingdom', value5: '71,72,73,74,75,76,77,78,79', value6: '10', value7: '7400 123456' },
                    { parameter_id: 1, key: 'in', value3: '+91', value4: 'India', value5: '7,8,9', value6: '10', value7: '81234 56789' },
                    { parameter_id: 1, key: 'ru', value3: '+7', value4: 'Russia', value5: '90,91,92,93,95', value6: '10', value7: '912 345 67 89' },
                    { parameter_id: 1, key: 'by', value3: '+375', value4: 'Belarus', value5: '25,29,33,34', value6: '9', value7: '29 491 19 11' },
                    { parameter_id: 1, key: 'ro', value3: '+40', value4: 'Romania', value5: '71,72,73,74,75,76,77,78', value6: '9', value7: '712 034 567' },
                    { parameter_id: 1, key: 'jp', value3: '+81', value4: 'Japan', value5: '60,70,80,90', value6: '10', value7: '90 1234 5678' },
                    { parameter_id: 1, key: 'il', value3: '+972', value4: 'Israel', value5: '50,52,53,54,55,58', value6: '9', value7: '50 234 5678' },
                    { parameter_id: 1, key: 'tr', value3: '+90', value4: 'Turkey', value5: '50,53,54,55', value6: '10', value7: '501 234 56 78' },
                    { parameter_id: 1, key: 'kr', value3: '+82', value4: 'South Korea', value5: '10,11,16,17,18,19', value6: '10', value7: '10 2000 0000' })
