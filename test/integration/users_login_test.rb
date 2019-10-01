require 'test_helper'

class UsersLoginTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
  end
  
  test "login with invalid information" do
    get login_path
    assert_template 'sessions/new'
    post login_path, params: { session: { login: "", password: "" } }
    assert_template 'sessions/new'
    assert_not flash.empty?
    get root_path
    assert flash.empty?
  end
  test "login with valid information" do
    get login_path
    post login_path, params: { session: { login:    @user.login,
                                          last_name: @user.last_name,
                                          password: 'test' } }
    assert is_logged_in?
    assert_redirected_to @user
    follow_redirect!
    assert_template 'users/show'
  end
  test "login with valid information followed by logout" do
    get login_path
    post login_path, params: { session: { login:    @user.login,
                                          last_name: @user.last_name,
                                          password: 'test' } }
    assert is_logged_in?
    assert_redirected_to @user
    follow_redirect!
    assert_template 'users/show'
    delete logout_path
    assert_not is_logged_in?
    assert_redirected_to root_url
    # Simulate a user clicking logout in a second window.
    delete logout_path
    follow_redirect!
    assert_template 'sessions/new'
  end
end
