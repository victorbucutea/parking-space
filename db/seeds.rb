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
                      {id: 1,name: 'country' , default_value: 'ro'},
                      {id: 2,name: 'bid_price_epsilon', default_value: 0.05},
                  ])


ParameterValue.create!([
                           {parameter_id: 6,key: 'en', value: 5   , value2: 'Usd', value3: '+1', value4: 'United States of America'},
                           {parameter_id: 6,key: 'ae', value: 5   , value2: 'Usd', value3: '+971', value4: 'United Arab Emirates'},
                           {parameter_id: 6,key: 'ca', value: 5   , value2: 'Usd', value3: '+1', value4: 'Canada'},
                           {parameter_id: 6,key: 'sa', value: 5   , value2: 'Usd', value3: '+966', value4: 'Saudi Arabia'},
                           {parameter_id: 6,key: 'fr', value: 5   , value2: 'Eur', value3: '+33', value4: 'France'},
                           {parameter_id: 6,key: 'de', value: 5   , value2: 'Eur', value3: '+49', value4: 'Germany'},
                           {parameter_id: 6,key: 'sk', value: 3   , value2: 'Eur', value3: '+421', value4: 'Slovakia'},
                           {parameter_id: 6,key: 'si', value: 3   , value2: 'Eur', value3: '+386', value4: 'Slovenia'},
                           {parameter_id: 6,key: 'hu', value: 2   , value2: 'Eur', value3: '+36', value4: 'Hungary'},
                           {parameter_id: 6,key: 'au', value: 5   , value2: 'Eur', value3: '+43', value4: 'Austria'},
                           {parameter_id: 6,key: 'cz', value: 3   , value2: 'Eur', value3: '+420', value4: 'Czech Republic'},
                           {parameter_id: 6,key: 'pl', value: 3   , value2: 'Eur', value3: '+48', value4: 'Poland'},
                           {parameter_id: 6,key: 'ch', value: 5   , value2: 'Eur', value3: '+41', value4: 'Switzerland'},
                           {parameter_id: 6,key: 'es', value: 3   , value2: 'Eur', value3: '+34', value4: 'Spain'},
                           {parameter_id: 6,key: 'pt', value: 5   , value2: 'Eur', value3: '+351', value4: 'Portugal'},
                           {parameter_id: 6,key: 'lu', value: 3   , value2: 'Eur', value3: '+352', value4: 'Luxembourg'},
                           {parameter_id: 6,key: 'be', value: 5   , value2: 'Eur', value3: '+32', value4: 'Belgium'},
                           {parameter_id: 6,key: 'nl', value: 5   , value2: 'Eur', value3: '+31', value4: 'Netherlands'},
                           {parameter_id: 6,key: 'dk', value: 5   , value2: 'Eur', value3: '+45', value4: 'Denmark'},
                           {parameter_id: 6,key: 'fi', value: 5   , value2: 'Eur', value3: '+358', value4: 'Finland'},
                           {parameter_id: 6,key: 'lt', value: 2   , value2: 'Eur', value3: '+370', value4: 'Lithuania'},
                           {parameter_id: 6,key: 'ee', value: 2   , value2: 'Eur', value3: '+372', value4: 'Estonia'},
                           {parameter_id: 6,key: 'lv', value: 2   , value2: 'Eur', value3: '+371', value4: 'Latvia'},
                           {parameter_id: 6,key: 'se', value: 5   , value2: 'Eur', value3: '+46', value4: 'Sweden'},
                           {parameter_id: 6,key: 'ua', value: 3   , value2: 'Eur', value3: '+380', value4: 'Ukraine'},
                           {parameter_id: 6,key: 'gr', value: 3   , value2: 'Eur', value3: '+30', value4: 'Greece'},
                           {parameter_id: 6,key: 'it', value: 5   , value2: 'Eur', value3: '+39', value4: 'Italy'},
                           {parameter_id: 6,key: 'gb', value: 3   , value2: 'Gbp', value3: '+44', value4: 'United Kingdom'},
                           {parameter_id: 6,key: 'in', value: 20  , value2: 'Inr', value3: '+91', value4: 'India'},
                           {parameter_id: 6,key: 'ru', value: 30  , value2: 'Rur', value3: '+7', value4: 'Russia'},
                           {parameter_id: 6,key: 'by', value: 20  , value2: 'Rur', value3: '+375', value4: 'Belarus'},
                           {parameter_id: 6,key: 'ro', value: 5   , value2: 'Ron', value3: '+40', value4: 'Romania'},
                           {parameter_id: 6,key: 'jp', value: 50  , value2: 'Yen', value3: '+81', value4: 'Japan'},
                           {parameter_id: 6,key: 'il', value: 5   , value2: 'Ils', value3: '+972', value4: 'Israel'},
                           {parameter_id: 6,key: 'tr', value: 3   , value2: 'Try', value3: '+90', value4: 'Turkey'},
                           {parameter_id: 6,key: 'kr', value: 1000, value2: 'Krw', value3: '+82', value4: 'South Korea'}
                       ])