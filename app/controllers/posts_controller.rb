class PostsController < ApplicationController
  before_action :find_post, only: [:edit, :update]

  def new
    @post = Post.new
  end
  
  def create
    @post = Post.new(post_params)
    if @post.save
      flash[:success] = "Создан пост"
      redirect_to posts_path
    else
      render 'new'
    end
  end

  def edit
  end  
  
  def update
    if not @post.update post_params
      render :action => :edit
    else
      redirect_to posts_path
    end
  end
  
  def index
    @posts = Post.all.order(:id)
  end

  private
    def post_params
      params.require(:post).permit(:city_id, :site_type_id, :name, :substances_num, :coordinates, :coordinates_sign, :vd, :height, :active, :laboratory_id, :short_name, :sample_volume_dust)
    end
    
    def find_post
      @post = Post.find(params[:id])
    end
end
