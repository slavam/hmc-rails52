class BulletinMailer < ApplicationMailer
  def autodor_email
    bulletin = params[:bulletin]
    pdf = Avtodor.new(bulletin)
    folder = Rails.env.production? ? "public/asset/pdf" : "app/assets/pdf_folder"
    filename = File.join(Rails.root, folder, "bulletin_for_email.pdf")
    pdf.render_file(filename)
    attachments['bulletin.pdf'] = File.read(filename)
    recivers = Rails.env.production? ? ["mail@add-ldnr.ru", "avtodordonbassd@mail.ru"]:["morgachev@dnr.mecom.ru"]
    mail(to: recivers, subject: "Бюллетень  № #{bulletin.curr_number} от #{bulletin.report_date.strftime("%d.%m.%Y")}")
  end
end
