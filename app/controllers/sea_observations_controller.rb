class SeaObservationsController < ApplicationController
  before_action :find_sea_observation, only: [:show, :destroy, :update_sea_telegram]
  
  def get_conversion_interval
    @sea_old_count = OldHydroTelegram.where("Телеграмма like '%МОРЕ%'").count
    @min_date_old = OldHydroTelegram.where("Телеграмма like '%МОРЕ%'").select('min(Дата) as Дата')[0]["Дата"]
    @sea_new_count = SeaObservation.count
  end
  
  def converter
    date_from = params[:interval][:date_from].tr("-", ".")+' 00:00:00'
    date_to = params[:interval][:date_to].tr("-", ".")+' 23:59:59'
    old_telegrams = OldHydroTelegram.where("Дата >= ? and Дата <= ? and Телеграмма like 'МОРЕ %'", date_from, date_to).order("Дата")
    selected_telegrams = old_telegrams.size
    skiped_telegrams = 0
    wrong_telegrams = 0
    created_telegrams = 0
    # File.open("app/assets/pdf_folder/sea_conversion.txt",'w') do |mylog|
    File.open("tmp/sea_conversion_protocol.txt",'w') do |mylog|
      mylog.puts "Конверсия телеграмм МОРЕ за период с #{date_from} по #{date_to}"
      old_telegrams.each do |t|
        date_dev = t["Дата"][0,10].tr(".","-")
        term = t["Телеграмма"][7,2]
        observation = SeaObservation.where("date_dev like '#{date_dev}%' and term = ?", term)
        if observation.present? # and observation.size>0
          mylog.puts "Дата: #{date_dev}; Срок: #{term}. Уже имеется. Old =>#{t["Телеграмма"]}; New =>#{observation[0].telegram};"
          skiped_telegrams += 1
        else
          errors = []
          telegram = convert_sea_telegram(t, errors)
          if telegram.present?
            if telegram.save
              created_telegrams += 1
            else
              mylog.puts "Ошибка при записи в базу. #{telegram.telegram}"
            end
          else
            mylog.puts errors[0]+' => '+t["Дата"]+'->'+t["Телеграмма"]
            wrong_telegrams += 1
          end
        end
      end
      mylog.puts '='*80
      mylog.puts "Всего поступило телеграмм - #{selected_telegrams}"
      mylog.puts "Создано - #{created_telegrams}; пропущено - #{skiped_telegrams}"
      mylog.puts "Ошибочных телеграмм - #{wrong_telegrams}"
    end
    flash[:success] = "Входных телеграмм - #{selected_telegrams}. Создано - #{created_telegrams}. Пропущено - #{skiped_telegrams}. Ошибочных телеграмм - #{wrong_telegrams}."
    redirect_to sea_observations_get_conversion_interval_path
  end

  def conversion_log_download
    send_file("#{Rails.root}/tmp/sea_conversion_protocol.txt")
  end
  
  def show
    # date_from ||= params[:date_from].present? ? params[:date_from] : Time.now.strftime("%Y-%m-%d")
    # date_to ||= params[:date_to].present? ? params[:date_to] : Time.now.strftime("%Y-%m-%d")
    # station = params[:station_id].present? ? "&station_id=#{params[:station_id]}" : ''
    # text = params[:text].present? ? "&text=#{params[:text]}" : ''
    # @search_link = "/radiation_observations/search_radiation_telegrams?telegram_type=radiation&date_from=#{date_from}&date_to=#{date_to}#{station}#{text}"
    @actions = Audit.where("auditable_id = ? and auditable_type = 'SeaObservation'", @sea_observation.id)
  end
  
  def index
    @sea_observations = SeaObservation.paginate(page: params[:page]).order(:date_dev, :station_id).reverse_order
  end
  
  def input_sea_rf
    @telegrams = SeaObservation.where("telegram like 'SEA%'").order(date_dev: :desc, station_id: :asc).limit(20)
  end

  def create_sea_rf
    telegram = SeaObservation.find_by(station_id: params[:sea_observation][:station_id],
      date_dev: params[:sea_observation][:date_dev], term: params[:sea_observation][:term])
    if telegram.present?
      if telegram.update sea_observation_params
        last_telegrams = SeaObservation.where("telegram like 'SEA%'").order(date_dev: :desc, station_id: :asc).limit(20)
        render json: {telegrams: last_telegrams, 
                      errors: ["Телеграмма изменена"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    else
      new_sea = SeaObservation.new(sea_observation_params)
      if new_sea.save
        ActionCable.server.broadcast("synoptic_telegram_channel", {'telegram' => new_sea.as_json, 'tlgType' => 'sea'})
        render json: {tlgType: 'sea', errors: ["Телеграмма добавлена"]}
      else
        render json: {errors: new_sea.errors.messages}, status: :unprocessable_entity
      end
    end
  end

  def input_sea_telegrams
    @stations = Station.all.order(:name)
    @telegrams = SeaObservation.short_last_50_telegrams(current_user)
  end
  
  def create_sea_telegram
    # date_dev = params[:input_mode] == 'direct' ? Time.parse(params[:date]+' 00:01:00 UTC') : Time.now.utc 20190517 mwm
    date_dev = params[:input_mode] == 'direct' ? params[:date]+' 04:00:00' : Time.now.strftime("%Y-%m-%d 04:00:00")
    # sql = "select * from radiation_observations where station_id = #{params[:radiation_observation][:station_id]} and hour_observation = #{params[:radiation_observation][:hour_observation]} and date_observation = '#{left_time}' order by telegram_date desc"
    # telegram = StormObservation.find_by_sql(sql).first
    # telegram = SeaObservation.find_by(station_id: params[:sea_observation][:station_id], hour_observation: params[:sea_observation][:hour_observation], date_observation: params[:sea_observation][:date_observation])
    telegram = SeaObservation.find_by(station_id: params[:sea_observation][:station_id], term: params[:sea_observation][:term], date_dev: params[:sea_observation][:date_dev])
    # Rails.logger.debug("My object>>>>>>>>>>>>>>>: #{telegram.inspect}")
    if telegram.present?
      if telegram.update sea_observation_params
        last_telegrams = SeaObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, 
                      tlgType: 'sea', 
                      inputMode: params[:input_mode],
                      currDate: date_dev, 
                      errors: ["Телеграмма изменена"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    else
      telegram = SeaObservation.new(sea_observation_params)
      telegram.date_dev = date_dev # 20190517 дата наблюдения - локальная
      if telegram.save
        # new_telegram = {id: telegram.id, date: telegram.date_observation, station_name: telegram.station.name, telegram: telegram.telegram}
        new_telegram = {id: telegram.id, date: telegram.date_dev, station_name: telegram.station.name, telegram: telegram.telegram}
        ActionCable.server.broadcast("synoptic_telegram_channel", {telegram: new_telegram, tlgType: 'sea'})
        last_telegrams = SeaObservation.short_last_50_telegrams(current_user)
        render json: {telegrams: last_telegrams, 
                      tlgType: 'sea', 
                      inputMode: params[:input_mode],
                      currDate: date_dev, #telegram.telegram_date, 
                      errors: ["Телеграмма корректна"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
      end
    end
  end
  
  def get_last_telegrams
    telegrams = SeaObservation.short_last_50_telegrams(current_user)
    render json: {telegrams: telegrams, tlgType: 'sea'}
  end
  
  def update_sea_telegram
    if @sea_observation.update sea_observation_params
      render json: {errors: []}
    else
      render json: {errors: ["Ошибка при сохранении изменений"]}, status: :unprocessable_entity
    end
  end
  
  def destroy
    @sea_observation.destroy
    flash[:success] = "Телеграмма удалена"
    redirect_to sea_observations_path
  end
  
  private
    def find_sea_observation
      @sea_observation = SeaObservation.find(params[:id])
    end
    
    def sea_observation_params
      params.require(:sea_observation).permit(:telegram, :station_id, :date_dev, :term, :day_obs) # :hour_observation, :date_observation)
    end
    
    def convert_sea_telegram(old_telegram, errors)
      text_telegram = old_telegram["Телеграмма"].gsub(/\s+/, ' ')
      # groups = old_telegram["Телеграмма"].gsub(/\s+/, ' ').tr('=', '').split(' ')
      new_telegram = SeaObservation.new
      new_telegram.date_dev = (old_telegram["Дата"].tr('.', '-')).to_date
      new_telegram.telegram = text_telegram
      
      if text_telegram[0,5] != "МОРЕ "
        errors.push("Ошибка в различительной группе");
        return nil;
      end
      if text_telegram[10,5] == '99023'
        new_telegram.station_id = 10
      else
        errors << "Ошибка в коде станции - <#{text_telegram[10,5]}>"
        return nil
      end
      if old_telegram["Дата"][8,2] == text_telegram[5,2]
        new_telegram.day_obs = text_telegram[5,2].to_i
      else 
        errors << "Число месяца не соответствует дню даты наблюдения" # 20181126 А.O.A.
        return nil;
      end
      if [3,9,15,21].include?(text_telegram[7,2].to_i)
        new_telegram.term = text_telegram[7,2].to_i
      else
        errors << "Ошибка в сроке"
        return nil;
      end
      if (text_telegram[16,5] =~ /[01239]\d{4}/).present?
      else 
        errors << "Ошибка в группе ветер-видимость"
        return nil
      end
      if (text_telegram[22,5] =~ /\d{5}/).present?
      else
        errors << "Ошибка в группе температуры"
        return nil
      end
      curr_pos = 28
      if text_telegram[curr_pos,2] == '90'
        if (text_telegram[curr_pos,5] =~ /90\d{3}/).present?
          curr_pos += 6
        else 
          errors << "Ошибка в группе 90"
          return nil
        end
      end
      if text_telegram[curr_pos,2] == '91'
        if (text_telegram[curr_pos,5] =~ /91\d{3}/).present?
          curr_pos += 6
        else 
          errors << "Ошибка в группе 91"
          return nil
        end
      end
      if text_telegram[curr_pos] == '3'
        if(text_telegram[curr_pos,5] =~ /^3[3489]\d{3}$/).present?
          curr_pos += 6
        else 
          errors << "Ошибка в группе 3"
          return nil
        end
      end
      if text_telegram[curr_pos] == '4'
        if (text_telegram[curr_pos,5] =~ /^40[0-6][0-9\/]\d$/).present?
          curr_pos += 6
        else 
          errors << "Ошибка в группе 4"
          return nil
        end
      end
      if (text_telegram[curr_pos] =~ /[125]/).present?
        if (text_telegram[curr_pos,5] =~ /^[125]\d{4}$/).present?
          curr_pos += 6
        else
          errors << "Ошибка в группе 5"
          return nil
        end
      end
      if text_telegram[curr_pos] == '6'
        if(text_telegram[curr_pos,5] =~ /^6\d[0-7]\d{2}$/).present?
          curr_pos += 6
        else 
          errors << "Ошибка в группе 6"
          return nil
        end
      end
      if text_telegram[curr_pos] == '7'
        i = 1;
        while (curr_pos < text_telegram.size) do
          if (text_telegram[curr_pos,5] =~ /^7\d{2}[0-9\/]{2}$/).present?
            curr_pos +=6
          else
            errors << "Ошибка в группе 7[#{i}]"
            return nil
          end
          i += 1
        end
      end
      new_telegram
    end
end
