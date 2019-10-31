# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


ParameterValue.delete_all
Parameter.delete_all
Parameter.create!([
                      {id: 1, name: 'country', default_value: 'ro'},
                      {id: 2, name: 'bid_price_epsilon', default_value: 0.05},
                  ])
ParameterValue.create!([
                           {parameter_id: 1, key: 'en', value: 5, value2: 'Usd', value3: '+1', value4: 'United States of America'},
                           {parameter_id: 1, key: 'ae', value: 5, value2: 'Usd', value3: '+971', value4: 'United Arab Emirates'},
                           {parameter_id: 1, key: 'ca', value: 5, value2: 'Usd', value3: '+1', value4: 'Canada'},
                           {parameter_id: 1, key: 'sa', value: 5, value2: 'Usd', value3: '+966', value4: 'Saudi Arabia'},
                           {parameter_id: 1, key: 'fr', value: 5, value2: 'Eur', value3: '+33', value4: 'France'},
                           {parameter_id: 1, key: 'de', value: 5, value2: 'Eur', value3: '+49', value4: 'Germany'},
                           {parameter_id: 1, key: 'sk', value: 3, value2: 'Eur', value3: '+421', value4: 'Slovakia'},
                           {parameter_id: 1, key: 'si', value: 3, value2: 'Eur', value3: '+386', value4: 'Slovenia'},
                           {parameter_id: 1, key: 'hu', value: 2, value2: 'Eur', value3: '+36', value4: 'Hungary'},
                           {parameter_id: 1, key: 'au', value: 5, value2: 'Eur', value3: '+43', value4: 'Austria'},
                           {parameter_id: 1, key: 'cz', value: 3, value2: 'Eur', value3: '+420', value4: 'Czech Republic'},
                           {parameter_id: 1, key: 'pl', value: 3, value2: 'Eur', value3: '+48', value4: 'Poland'},
                           {parameter_id: 1, key: 'ch', value: 5, value2: 'Eur', value3: '+41', value4: 'Switzerland'},
                           {parameter_id: 1, key: 'es', value: 3, value2: 'Eur', value3: '+34', value4: 'Spain'},
                           {parameter_id: 1, key: 'pt', value: 5, value2: 'Eur', value3: '+351', value4: 'Portugal'},
                           {parameter_id: 1, key: 'lu', value: 3, value2: 'Eur', value3: '+352', value4: 'Luxembourg'},
                           {parameter_id: 1, key: 'be', value: 5, value2: 'Eur', value3: '+32', value4: 'Belgium'},
                           {parameter_id: 1, key: 'nl', value: 5, value2: 'Eur', value3: '+31', value4: 'Netherlands'},
                           {parameter_id: 1, key: 'dk', value: 5, value2: 'Eur', value3: '+45', value4: 'Denmark'},
                           {parameter_id: 1, key: 'fi', value: 5, value2: 'Eur', value3: '+358', value4: 'Finland'},
                           {parameter_id: 1, key: 'lt', value: 2, value2: 'Eur', value3: '+370', value4: 'Lithuania'},
                           {parameter_id: 1, key: 'ee', value: 2, value2: 'Eur', value3: '+372', value4: 'Estonia'},
                           {parameter_id: 1, key: 'lv', value: 2, value2: 'Eur', value3: '+371', value4: 'Latvia'},
                           {parameter_id: 1, key: 'se', value: 5, value2: 'Eur', value3: '+46', value4: 'Sweden'},
                           {parameter_id: 1, key: 'ua', value: 3, value2: 'Eur', value3: '+380', value4: 'Ukraine'},
                           {parameter_id: 1, key: 'gr', value: 3, value2: 'Eur', value3: '+30', value4: 'Greece'},
                           {parameter_id: 1, key: 'it', value: 5, value2: 'Eur', value3: '+39', value4: 'Italy'},
                           {parameter_id: 1, key: 'gb', value: 3, value2: 'Gbp', value3: '+44', value4: 'United Kingdom'},
                           {parameter_id: 1, key: 'in', value: 20, value2: 'Inr', value3: '+91', value4: 'India'},
                           {parameter_id: 1, key: 'ru', value: 30, value2: 'Rur', value3: '+7', value4: 'Russia'},
                           {parameter_id: 1, key: 'by', value: 20, value2: 'Rur', value3: '+375', value4: 'Belarus'},
                           {parameter_id: 1, key: 'ro', value: 5, value2: 'Ron', value3: '+40', value4: 'Romania'},
                           {parameter_id: 1, key: 'jp', value: 50, value2: 'Yen', value3: '+81', value4: 'Japan'},
                           {parameter_id: 1, key: 'il', value: 5, value2: 'Ils', value3: '+972', value4: 'Israel'},
                           {parameter_id: 1, key: 'tr', value: 3, value2: 'Try', value3: '+90', value4: 'Turkey'},
                           {parameter_id: 1, key: 'kr', value: 1000, value2: 'Krw', value3: '+82', value4: 'South Korea'}
                       ])


Role.delete_all

Role.create!([{id: 1, identifier: 'sensor_admin'},
              {id: 2, identifier: 'city_admin'},
              {id: 2, identifier: 'company_admin'},
              {id: 3, identifier: 'parking_lot_admin'},
              {id: 4, identifier: 'parking_lot_viewer'}])

ParkingPerimeter.destroy_all
Section.destroy_all
Location.destroy_all
Company.destroy_all

company = Company.create!({id: 1,
                           name: "SOCIETE GENERALE EUROPEAN BUSINESS SERVICES SA ",
                           address: "West Gate Park, Strada Preciziei nr. 24, cladirea H4, etaj 5, sector 6 013981, Bucuresti, Romania",
                           cui: "27883477",
                               registry: "J40/151/2011",
                  short_name: "SG EBS"
                 })

User.destroy_all

user = User.new
user.full_name = 'Victor-Florin Bucutea'
user.email = 'victor-florin.bucutea-ext@socgen.com'
user.password = 'pasword123'
user.password_confirmation = 'pasword123'
user.company = company
user.save!

user = User.new
user.full_name = 'Sorin Diaconescu'
user.email = 'sorin.diaconescu-ext@socgen.com'
user.password = 'pasword123'
user.password_confirmation = 'pasword123'
user.company = company
user.save!

user = User.new
user.full_name = 'Marius Dumitrescu'
user.email = 'marius.dumitrescu-ext@socgen.com'
user.password = 'pasword123'
user.password_confirmation = 'pasword123'
user.company = company
user.save!

user = User.new
user.full_name = 'Catalin Lupsa'
user.email = 'catalin.lupsa-ext@socgen.com'
user.password = 'pasword123'
user.password_confirmation = 'pasword123'
user.company = company
user.save!

user = User.new
user.full_name = 'Alexandru-Cosmin Ivan'
user.email = 'alexandru-cosmin.ivan-ext@socgen.com'
user.password = 'pasword123'
user.password_confirmation = 'pasword123'
user.company = company
user.save!

user = User.new
user.full_name = 'Constantin Agapi'
user.email = 'constantin.agapi-ext@socgen.com'
user.password = 'pasword123'
user.password_confirmation = 'pasword123'
user.company = company
user.save!

Rule.delete_all

Rule.create!([{id: 1,
               description: 'Rezervarea locului se poate face doar cu 1h inaintea ocuparii locului.',
               name: 'Rezervare doar cu 1h inainte',
               start: 60,
               stop: 0,
               type: 'TimeBeforeReservationRule'
              },
              {id: 2,
               description: 'Rezervarea locului se poate face doar cu 1.5h inaintea ocuparii locului.',
               name: 'Rezervare doar cu 1.5h inainte',
               start: 90,
               stop: 0,
               type: 'TimeBeforeReservationRule',
              },
              {id: 3,
               description: 'Rezervarea locului se poate face doar cu 3h inaintea ocuparii locului.',
               name: 'Rezervare doar cu 3h inainte',
               start: 180,
               stop: 0,
               type: 'TimeBeforeReservationRule',
              },
              {id: 4,
               description: 'Durata maxima de rezervare a locului e de maxim 8h.',
               name: 'Durata rezervare 8h',
               start: 0,
               stop: 60 * 8,
               type: 'ReservationDurationRule',
              },
              {id: 5,
               description: 'Durata maxima de rezervare a locului e de maxim 12h.',
               name: 'Durata rezervare 12h',
               start: 0,
               stop: 60 * 12,
               type: 'ReservationDurationRule',
              },
              {id: 6,
               description: 'Rezervare doar in intervalul orelor lucratoare, incluzand week-end',
               name: 'Ore lucratoare cu weekend',
               start: 0,
               stop: 60,
               type: 'WorkingHoursRule',
              }])

