# This file is used by Rack-based servers to start the application.

if defined?(PhusionPassenger)
  PhusionPassenger.advertised_concurrency_level = 0
end

require_relative 'config/environment'

run Rails.application
