class OldAgroTelegramsController < ApplicationController
  # before_action :logged_user?
  def index
    @old_agro_telegrams = OldAgroTelegram.paginate(page: params[:page])
  end
end