class ApplicantsController < ApplicationController
  before_action :find_applicant, only: [:show, :edit, :update, :destroy]
  
  def index
    @applicants = Applicant.all.order(:created_at).reverse_order
  end
  
  def applicants_list
    @applicants = Applicant.all.order(:created_at).reverse_order
  end
  
  def new
    @applicant = Applicant.new
  end
  
  def create
    @applicant = Applicant.new(applicant_params)
    if @applicant.save
      # technicians = User.technicians
      # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{@applicant.inspect}")
      ActionCable.server.broadcast "candidate_channel",
        telegram_type: @applicant.telegram_type, # 'synoptic', # 
        message: @applicant.created_at # 'Hello!!!!!!!!!!!!!' #
      # technicians.each do |t|
      #   ActionCable.server.broadcast "candidate_channel_user_#{t.id}",
      #                             telegram_type:  @applicant.telegram_type,
      #                             username: current_user.login
      # end
      # flash[:success] = "Телеграмма записана в буфер"
      redirect_to applicants_path
    else
      render 'new'
    end
  end
  
  def to_buffer
    applicant = Applicant.new
    applicant.telegram = params[:tlgText]
    applicant.message = params[:message]
    applicant.telegram_type = params[:tlgType]
    if applicant.save
      ActionCable.server.broadcast "candidate_channel", applicant: applicant
      case params[:tlgType]
        when 'synoptic'
          last_telegrams = SynopticObservation.short_last_50_telegrams(current_user)
        when 'agro'
          last_telegrams = AgroObservation.short_last_50_telegrams(current_user)
        when 'agro_dec'
          last_telegrams = AgroDecObservation.short_last_50_telegrams(current_user)
        when 'storm'
          last_telegrams = StormObservation.short_last_50_telegrams(current_user)
      end
      render json: {telegrams: last_telegrams, tlgType: params[:tlgType], currDate: Time.now.utc.strftime("%Y-%m-%d")}
    else
      render json: {errors: applicant.errors.messages}, status: :unprocessable_entity
    end
  end
  
  def edit
  end

  def update
    if not @applicant.update_attributes applicant_params
      render :action => :edit
    else
      redirect_to applicants_path
    end
  end
  
  def destroy
    @applicant.destroy
    flash[:success] = "Телеграмма удалена"
    redirect_to applicants_path
  end
  
  private
    def applicant_params
      params.require(:applicant).permit(:telegram, :telegram_type, :message)  
    end
    
    def find_applicant
      @applicant = Applicant.find(params[:id])
    end
end
