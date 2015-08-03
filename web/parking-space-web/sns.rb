require 'rubygems'
require 'aws-sdk'


sns = Aws::SNS::Client.new(
    access_key_id: 'AKIAJDJ3CBBADUIFLPRQ',
    secret_access_key: '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',
    region: 'eu-west-1',
    ssl_ca_bundle: 'c:\tmp\ca-bundle.crt'
)


platform_app = sns.create_platform_application(
    # required
    name: "parking-space-web",
    # required
    platform: "GCM",
    # required
    attributes:
        { :PlatformCredential => "AIzaSyDPUL3kus7j_yLmVBvj0UO7XIQww2yKJEg" ,
          :PlatformPrincipal => "" }
)

puts platform_app['platform_application_arn']


endpoint = sns.create_platform_endpoint(
    # required
    platform_application_arn: platform_app['platform_application_arn'],
    # required
    token: "app1"
)

subscription = sns.subscribe(
    # required
    topic_arn: "arn:aws:sns:eu-west-1:498966007496:offers",
    # required
    protocol: "application",
    endpoint: endpoint['endpoint_arn'],
)

resp = sns.confirm_subscription(
    # required
    topic_arn: "arn:aws:sns:eu-west-1:498966007496:offers",
    # required
    token: 'app1'
)



