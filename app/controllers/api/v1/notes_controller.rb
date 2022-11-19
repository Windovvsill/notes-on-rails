class Api::V1::NotesController < ApplicationController
    def index
      @notes = Note.all
      render json: @notes
    end
  
    def show
      @note = Note.find(params[:id])
      render json: @note
    end
  
    def new
      @note = Note.new
    end
  
    def create
      @note = Note.new(title: "...", body: "...")
  
      if @note.save
        redirect_to @note
      else
        render json: :new, status: :unprocessable_entity
      end
    end
  
    def edit
      @note = Note.find(params[:id])
      render json: @note
    end
  
    def update
      @note = Note.find(params[:id])
  
      if @note.update(note_params)
        redirect_to @note
      else
        render json: :edit, status: :unprocessable_entity
      end
    end
  
    def destroy
      @note = Note.find(params[:id])
      @note.destroy
  
      redirect_to root_path, status: :see_other
    end
  
    private
      def note_params
        params.require(:note).permit(:title, :body)
      end
    end
