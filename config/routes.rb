# frozen_string_literal: true

Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/parking-super-admin', as: 'rails_admin'
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

  match 'users*' => 'registrations#cors_preflight_check', via: [:options]

  devise_for :users, controllers: { sessions: 'sessions', registrations: 'registrations', passwords: 'passwords' }

  # provide a screen to confirm the password reset
  devise_scope :user do
    post '/users/sign_in_fb' => 'sessions#sign_in_fb', :as => 'sign_in_fb'
    get '/users/password/done' => 'passwords#done', :as => 'done_user_password'
  end

  namespace :users do
    get 'client_token'
    get 'list_users'
    post 'validate_code'
    post 'send_new_code'
    post 'attach_images'
    post 'register_for_notifications'
  end

  resources :parameters

  resources :accounts do
    collection do
      post 'withdraw'
      post 'cancel_withdrawal'
      post 'reject_withdrawal'
      post 'execute_withdrawal'
      get 'withdrawals'
      get 'payments'
      get 'payment_details'
      get 'list_account'
    end
  end

  resources :parking_spaces do
    member do
      post 'attach_documents'
      post 'attach_images'
      get 'documents'
    end

    collection do
      get 'myspaces'
      get 'myoffers'
      get 'list_spaces'
      get 'list_offers'
    end

    resources :proposals do
      member do
        post 'pay'
        post 'reject'
        post 'approve'
        post 'cancel'
      end
      collection do
        get 'next'
        get 'schedule'
      end
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
