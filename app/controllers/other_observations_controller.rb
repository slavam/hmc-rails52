class OtherObservationsController < ApplicationController
  def index
    @factor = params[:factor]
    @other_observations = OtherObservation.where('data_type = ?', @factor).paginate(page: params[:page]).order(:obs_date, :id).reverse_order
  end

  def input_other_telegrams
    @stations =  Station.name_stations_as_array #all.order(:name)
    @observations = OtherObservation.last_50_telegrams('temp') #.to_json
    @input_mode = params[:input_mode]
  end

  def get_last_telegrams
    observations = OtherObservation.last_50_telegrams(params[:data_type])
    render json: {observations: observations}
  end

  def create_other_data
    data_type = params[:other_observation][:data_type]
    if data_type == 'perc'
      observation = OtherObservation.find_by(data_type: params[:other_observation][:data_type],
          source: params[:other_observation][:source],
          period: params[:other_observation][:period],
          obs_date: params[:other_observation][:obs_date])
    else
      observation = OtherObservation.find_by(data_type: params[:other_observation][:data_type],
          station_id: params[:other_observation][:station_id],
          obs_date: params[:other_observation][:obs_date])
    end
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{telegram.inspect}")
    if observation.present?
      if observation.update_attributes other_observation_params
        last_telegrams = OtherObservation.last_50_telegrams(params[:other_observation][:data_type])
        render json: {observations: last_telegrams,
                      errors: ["Данные изменены"]}
      else
        render json: {errors: observation.errors.messages}, status: :unprocessable_entity
      end
    else
      observation = OtherObservation.new(other_observation_params)
      if observation.save
        # new_telegram = {id: telegram.id, date: telegram.date_observation, station_name: telegram.snow_point.name, telegram: telegram.telegram}
        # ActionCable.server.broadcast "synoptic_telegram_channel", telegram: new_telegram, tlgType: 'snow'
        last_telegrams = OtherObservation.last_50_telegrams(params[:other_observation][:data_type])
        render json: {observations: last_telegrams,
                      # tlgType: 'snow',
                      # inputMode: params[:input_mode],
                      # observationDate: date_dev,
                      errors: ["Данные сохранены"]}
      else
        # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{observation.errors.messages.inspect}")
        render json: {errors: observation.errors.messages}, status: :unprocessable_entity
      end
    end
  end

  def delete_other_data
    observation = OtherObservation.find(params[:id])
    data_type = observation.data_type
    if observation.destroy
      # ActionCable.server.broadcast "candidate_channel", applicant: @applicant, action: 'delete'
      last_telegrams = OtherObservation.last_50_telegrams(data_type)
      render json: {observations: last_telegrams, errors: ["Запись удалена"]}
    else
      render json: {errors: observation.errors.messages}, status: :unprocessable_entity
    end
  end

  def monthly_precipitation
    @year = params[:year].present? ? params[:year] : Time.now.year.to_s
    @month = params[:month].present? ? params[:month] : Time.now.month.to_s.rjust(2, '0')
    @precipitation = get_month_precipitation(@year, @month)
    respond_to do |format|
      format.html
      format.json do
        render json: {precipitation: @precipitation}
      end
    end
  end

  def get_month_precipitation(year, month)
    posts = ['Авдотьино', 'Кировский', 'Макеевка', 'Старобешево', 'Тельманово']
    last_day = Time.days_in_month(month.to_i, year.to_i).to_s.rjust(2, '0')
    start_date = year+'-'+month+'-01'
    end_date = year+'-'+month+'-'+last_day
    rows = OtherObservation.select("obs_date, source, period, value, description").
      where("obs_date >= ? AND obs_date <= ? AND data_type='perc'", start_date, end_date).order(:obs_date, :source, :period)
    precipitation = []
    rows.each {|p|
      d = p.obs_date.day
      s = posts.index(p.source)
      precipitation[d] ||= []
      precipitation[d][s] ||= [nil,nil,'','']

      if p.period == 'night'
        precipitation[d][s][0] = p.value
        precipitation[d][s][2] = p.description if p.description.present? and p.description > ''
      else
        precipitation[d][s][1] = p.value
        precipitation[d][s][3] = p.description if p.description.present? and p.description > ''
      end
      # pn = (p.period == 'night')? p.value : nil
      # pd = (p.period != 'night')? p.value : nil
      # val = []
      # val[0] = pn
      # val[1] = pd
      #
      # precipitation[d][s] = val
    }
    precipitation
  end

  private
    def other_observation_params
      params.require(:other_observation).permit(:data_type, :value, :obs_date, :station_id, :source, :description, :period)
    end
end
