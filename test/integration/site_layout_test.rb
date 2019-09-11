require 'test_helper'

class SiteLayoutTest < ActionDispatch::IntegrationTest
  test "layout links" do
    get root_path
    assert_template 'sessions/new'
    assert_select "a[href=?]", login_path
    assert_select "a[href=?]", "http://news.railstutorial.org/"
    get "/storm_observations/latest_storms"
    assert_template 'storm_observations/latest_storms'
    assert_select "a[href=?]", storm_observations_path
  end
end
