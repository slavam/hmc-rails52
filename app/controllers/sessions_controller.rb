class SessionsController < ApplicationController
  def new
  end
  
  def create
    # pw: #{params[:session][:password]}; Chesnov 2022-03-12!
    # 20220513 LMB File.write('./tmp/login.txt',"Local time: #{Time.now}; ip: #{request.remote_ip}; client_ip #{request.ip}; login: #{params[:session][:login]}; pw: #{params[:session][:password]}; agent: #{request.user_agent}; \n", mode: 'a')
    user = User.find_by(login: params[:session][:login])
    if user && user.authenticate(params[:session][:password])
      # Log the user in and redirect to the user's show page.
      log_in user
      remember user
      # redirect_to user 20190819
      redirect_back_or user
    else
      flash.now[:danger] = 'Ошибочная login/password комбинация'
      render 'new'
    end
  end

  def destroy
    log_out if logged_in?
    redirect_to root_url
  end
end
