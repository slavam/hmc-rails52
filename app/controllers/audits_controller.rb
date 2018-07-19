class AuditsController < ApplicationController
  before_action :require_admin

  def index
    @audits = Audit.paginate(page: params[:page]).order(:created_at).reverse_order
  end

  def show
    @audit = Audit.find params[:id]
    @value_field_names = @audit.action == 'update' ? 
      ['Old Value', 'New Value'] : ['Value']
    @changes = @audit.audited_changes.split("\n")
    @changes.delete_at(0)
    if @audit.action != 'update'
      added = [] 
      @changes.each do |v|
        v.split(":").each {|w| added << w}
      end
      @changes = added
    end
  end
end
