require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def setup
    @user = User.new(last_name: "test1", login: "test1", password: "test", password_confirmation: "test")
  end
  
  test "should be valid" do
    assert @user.valid?
  end
  
  test "login should be present" do
    @user.login = ""
    assert_not @user.valid?
  end
  
  test "last_name should be present" do
    @user.last_name = ""
    assert_not @user.valid?
  end
  
  test "role should be present" do
    @user.role = ''
    assert_not @user.valid?
  end
  
  test "role should be from ROLES" do
    @user.role = "dummy"
    assert_not @user.valid?
  end
  
  test "login should be unique" do
    duplicate_user = @user.dup
    @user.save
    assert_not duplicate_user.valid?
  end
  
  test "password should be present (nonblank)" do
    @user.password = @user.password_confirmation = " " * 6
    assert_not @user.valid?
  end

  test "password should have a minimum length" do
    @user.password = @user.password_confirmation = "aaa"
    assert_not @user.valid?
  end
  test "authenticated? should return false for a user with nil digest" do
    assert_not @user.authenticated?('')
  end
end
