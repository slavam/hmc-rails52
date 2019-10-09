require 'test_helper'

class UsersEditTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:michael)
    @other_user = users(:archer)
  end

  test "unsuccessful edit" do
    log_in_as(@user)
    get edit_user_path(@other_user)
    assert_template 'users/edit'
    patch user_path(@other_user), params: { user: { last_name:  "",
                                              login: "",
                                              password:              "foo",
                                              password_confirmation: "bar" } }

    assert_template 'users/edit'
  end
  
  test "successful edit" do
    log_in_as(@user)
    get edit_user_path(@other_user)
    assert_template 'users/edit'
    last_name  = "Иванов"
    first_name  = "Иван"
    login = "Ivanov"
    patch user_path(@other_user), params: { user: { last_name:  last_name,
                                              first_name: first_name,
                                              login: login,
                                              password:              "",
                                              password_confirmation: "" } }
    assert_not flash.empty?
    assert_redirected_to users_path
    @other_user.reload
    assert_equal login,  @other_user.login
    assert_equal last_name, @other_user.last_name
  end
end
