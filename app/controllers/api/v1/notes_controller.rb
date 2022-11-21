class Api::V1::NotesController < ApplicationController
    def index
      @notes = Note.order("notes.updated_at desc").all
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
      @note = Note.new(title: "", body: "")
  
      if @note.save
        render json: @note
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
        render json: @note
      else
        render json: :edit, status: :unprocessable_entity
      end
    end
  
    def destroy
      @note = Note.find(params[:id])
      @note.destroy
  
      render json: @note
    end
  
    private
      def note_params
        params.require(:note).permit(:title, :body)
      end
    end
