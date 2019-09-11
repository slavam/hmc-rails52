require 'test_helper'

class MeteoLinksControllerTest < ActionDispatch::IntegrationTest
  test "should get root" do
    get root_path
    assert_response :success
  end
  test "should get index" do
    get meteo_links_path
    assert_response :success
    assert_select "h3", "Динамические меню пользователей"
  end
  test "should get new" do
    get '/meteo_links/new'
    assert_response :success
    assert_select "h3", "Создать ссылку"
  end
end