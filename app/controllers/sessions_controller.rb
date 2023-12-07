class SessionsController < ApplicationController
  before_action :cors_preflight_check
  skip_before_action :verify_authenticity_token, :only => [:create, :destroy]
  def cors_preflight_check
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  end
  def new
  end
  
def create
    # pw: #{params[:session][:password]}; Chesnov 2022-03-12!
    # 20220513 LMB File.write('./tmp/login.txt',"Local time: #{Time.now}; ip: #{request.remote_ip}; client_ip #{request.ip}; login: #{params[:session][:login]}; pw: #{params[:session][:password]}; agent: #{request.user_agent}; \n", mode: 'a')
    # user = User.find_by(login: params[:session][:login])
    login = ''
    password = ''
    respond_to do |format|
      format.html do
        login = params[:session][:login]
        password = params[:session][:password]
      end
      format.json do
        login = params['login']
        password = params['password']
      end
    end
    user = User.find_by(login: login)
    if user && user.authenticate(password)
      # Log the user in and redirect to the user's show page.
      log_in user
      remember user
      respond_to do |format|
        format.html { redirect_back_or user }
        format.json { 
        # Rails.logger.debug("My object>>>>>>>>>>>>>>>updated_telegrams: #{user.inspect}")
        render json: {user: user}} 
      end
    else
      respond_to do |format|
        format.html do
          flash.now[:danger] = 'Ошибочная login/password комбинация'
          render 'new' 
        end
        format.json {render json: { status: 401 }}
      end
    end
  end
=begin
  def create
    # pw: #{params[:session][:password]}; Chesnov 2022-03-12!
    # 20220513 LMB File.write('./tmp/login.txt',"Local time: #{Time.now}; ip: #{request.remote_ip}; client_ip #{request.ip}; login: #{params[:session][:login]}; pw: #{params[:session][:password]}; agent: #{request.user_agent}; \n", mode: 'a')
    user = User.find_by(login: params[:session][:login].present? ? params[:session][:login]:params['username']) #[:session][:login])
# Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{user.inspect}")
    if user && user.authenticate(params[:session][:password])
      # Log the user in and redirect to the user's show page.
      log_in user
      remember user
      # redirect_to user 20190819
      # redirect_back_or user
      respond_to do |format|
        format.html do
          redirect_back_or user
        end
        format.json do
          render json: {user: user}
        end
      end
    else
      flash.now[:danger] = 'Ошибочная login/password комбинация'
      render 'new'
    end
  end
=end
  def destroy
    log_out if logged_in?
    redirect_to root_url
  end
end
