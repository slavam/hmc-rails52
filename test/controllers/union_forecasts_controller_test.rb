require 'test_helper'

class UnionForecastsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get union_forecasts_new_url
    assert_response :success
  end

  test "should get create" do
    get union_forecasts_create_url
    assert_response :success
  end

end
