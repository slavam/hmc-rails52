class OtherObservationsController < ApplicationController
  def input_other_telegrams
    @stations =  Station.all.order(:name)
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
                      # tlgType: 'snow', 
                      # inputMode: params[:input_mode],
                      # observationDate: date_dev, 
                      errors: ["Данные изменены"]}
      else
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
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
        render json: {errors: telegram.errors.messages}, status: :unprocessable_entity
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
  
  private
    def other_observation_params
      params.require(:other_observation).permit(:data_type, :value, :obs_date, :station_id, :source, :description, :period)
    end
end
