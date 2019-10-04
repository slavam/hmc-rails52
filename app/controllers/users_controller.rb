class UsersController < ApplicationController
  before_action :require_admin, :except => :show
  before_action :find_user, only: [:show, :edit, :update, :destroy]

  def require_admin
    if !logged_in? or !current_user.admin?
      redirect_to login_path, :alert => "Access denied."
    end
  end

  def index
    @users = User.all.order(:last_name)
  end
  
  def show
  end

  def new
    @user = User.new
  end
  
  def create
    @user = User.new(user_params)
    if @user.save
      flash[:success] = "Новый пользователь успешно создан"
      redirect_to @user
    else
      render 'new'
    end
  end
  
  def edit
  end

  def update
    if not @user.update_attributes user_params
      render 'edit'
    else
      flash[:success] = "Параметры пользователя изменены"
      redirect_to users_path
    end
  end
  
  def destroy
    @user.destroy
    flash[:success] = "Пользователь удален"
    redirect_to users_path
  end
  
  private

    def user_params
      params.require(:user).permit(:login, :first_name, :last_name, :middle_name, :position, :password, :password_confirmation, :role, :station_id)
    end
    
    def find_user
      @user = User.find(params[:id])
    end
end