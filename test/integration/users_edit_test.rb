require 'test_helper'

class UsersEditTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
  end

  test "unsuccessful edit" do
    log_in_as(@user)
    get edit_user_path(@user)
    assert_template 'users/edit'
    patch user_path(@user), params: { user: { last_name:  "",
                                              login: "",
                                              password:              "foo",
                                              password_confirmation: "bar" } }

    assert_template 'users/edit'
  end
  
  test "successful edit" do
    log_in_as(@user)
    get edit_user_path(@user)
    assert_template 'users/edit'
    last_name  = "Иванов"
    first_name  = "Иван"
    login = "Ivanov"
    patch user_path(@user), params: { user: { last_name:  last_name,
                                              first_name: first_name,
                                              login: login,
                                              password:              "",
                                              password_confirmation: "" } }
    assert_not flash.empty?
    assert_redirected_to users_path
    @user.reload
    assert_equal login,  @user.login
    assert_equal last_name, @user.last_name
  end
end
