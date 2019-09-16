class UserMenusController < ApplicationController
  before_action :find_user_menu, only: [:edit, :update, :destroy]
  
  def index
    @user_menus = UserMenu.all.order(:id)
  end
  def new
    @user_menu = UserMenu.new
  end
  def edit
  end
  def update
    if not @user_menu.update_attributes(user_menu_params)
      render 'edit'
    else
      flash[:success] = "Название изменено"
      redirect_to user_menus_path
    end
  end
  def create
    @user_menu = UserMenu.new(user_menu_params)
    if @user_menu.save
      flash[:success] ="Создано название меню"
      redirect_to user_menus_path
    else
      render 'new'
    end
  end
  private
    def find_user_menu
      @user_menu = UserMenu.find(params[:id])
    end
    def user_menu_params
      params.require(:user_menu).permit(:name)
    end
end