Rails.application.routes.draw do

  resources :reviews
  post 'sensor_auth/authenticate'

  resources :companies
  resources :locations
  resources :rules
  resources :roles do
    collection do
      get 'user_company_roles'
    end
  end

  resources :sections do
    post 'save_perimeters'
    get 'perimeters'
  end

  resources :sensors do
    post 'publish_free_perimeters'
    post 'save_perimeters'
    post 'snapshot'
    post 'perimeter_snapshot'
    get 'perimeters'
    get 'do_heartbeat'
    collection do
      get 'assigned'
      get 'with_location'
    end
  end

  match "users*" => "registrations#cors_preflight_check", via: [:options]

  devise_for :users, :controllers => {sessions: 'sessions', registrations: 'registrations', passwords: 'passwords'}

  #provide a screen to confirm the password reset
  devise_scope :user do
    get "/users/client_token" => "registrations#client_token", :as => "client_token"
    get "/users/create_payment_method" => "registrations#create_payment_method", :as => "create_payment_method"
    get "/users/password/done" => "passwords#done", :as => "done_user_password"
    get '/users/list' => 'registrations#list', :as => 'list'
    post "/users/sign_in_fb" => "sessions#sign_in_fb", :as => "sign_in_fb"
    post "/users/validate_code" => "registrations#validate_code", :as => "validate_code"
    post "/users/send_new_code" => "registrations#send_new_code", :as => "send_new_code"
    post "/users/register_for_notifications" => "registrations#register_for_notifications", :as => "register_for_notifications"

  end

  resources :parameters

  resources :accounts do
    post 'withdraw'
    get 'withdrawals'
    post 'cancel_withdrawal'
    post 'reject_withdrawal'
    post 'execute_withdrawal'
  end

  resources :parking_spaces do

    get 'mark_offers_as_read'

    post 'attach_documents'
    get 'documents'
    post 'attach_images'

    get 'phone_number'

    collection do
      get 'myspaces'
    end

    collection do
      get 'myoffers'
    end

    resources :proposals do
      post 'pay'
      get 'get_user_payments'
      get 'get_payment_details'
      get 'next'
      post 'reject'
      post 'approve'
      post 'cancel'
      resources :messages
    end
  end


  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'pages#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:i
  # d/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
