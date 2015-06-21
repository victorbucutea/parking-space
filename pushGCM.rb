require 'rubygems'
require 'pushmeup'
GCM.host = 'https://android.googleapis.com/gcm/send'
GCM.format = :json
GCM.key = "AIzaSyBav7lmoAirQqKUXjha6LURDfpISyt9AiE"
destination = ["APA91bG9rgHmnXRC_WuSMLXQjhLoxazLoXQIguijbqnma5LAXbQVcWkjjFmLVUrAyKisenBHTLW-POf5nbv23v5FW5oP6ekSrOHwHQso_yTb8jQH40tEWZm0Fqj_GZ278QUwpUcKssWuGcH5jCyXLwUmXcAVoARQjg"]
data = {:message => "PhoneGap Build rocks!", :msgcnt => "1", :soundname => "beep.wav"}

GCM.send_notification( destination, data)

